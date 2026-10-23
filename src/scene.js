// Motor 3D WebGL 2 minimalista e inteiramente local: nenhum pacote externo.
const PI=Math.PI;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const vec=(x=0,y=0,z=0)=>[x,y,z];
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
const mul=(a,s)=>[a[0]*s,a[1]*s,a[2]*s];
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=a=>{const l=Math.hypot(...a)||1;return mul(a,1/l)};
const I=()=>new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
const mm=(a,b)=>{const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++){let v=0;for(let k=0;k<4;k++)v+=a[k*4+r]*b[c*4+k];o[c*4+r]=v;}return o;};
const T=(x=0,y=0,z=0)=>{const m=I();m[12]=x;m[13]=y;m[14]=z;return m};
const S=(x=1,y=x,z=x)=>{const m=I();m[0]=x;m[5]=y;m[10]=z;return m};
const RX=a=>{const m=I(),c=Math.cos(a),s=Math.sin(a);m[5]=c;m[6]=s;m[9]=-s;m[10]=c;return m};
const RY=a=>{const m=I(),c=Math.cos(a),s=Math.sin(a);m[0]=c;m[2]=-s;m[8]=s;m[10]=c;return m};
const RZ=a=>{const m=I(),c=Math.cos(a),s=Math.sin(a);m[0]=c;m[1]=s;m[4]=-s;m[5]=c;return m};
const chain=(...ms)=>ms.reduce((a,b)=>mm(a,b),I());
const persp=(fov,aspect,near,far)=>{const f=1/Math.tan(fov/2),m=new Float32Array(16);m[0]=f/aspect;m[5]=f;m[10]=(far+near)/(near-far);m[11]=-1;m[14]=(2*far*near)/(near-far);return m};
const lookAt=(eye,target,up=[0,1,0])=>{const z=norm(sub(eye,target)),x=norm(cross(up,z)),y=cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1])};
const rand=(seed)=>()=>{seed=(Math.imul(seed,1664525)+1013904223)|0;return (seed>>>0)/4294967296};
const hex=h=>{h=h.replace('#','');return [parseInt(h.slice(0,2),16)/255,parseInt(h.slice(2,4),16)/255,parseInt(h.slice(4,6),16)/255]};
const C={fur:'#fff3da',furLight:'#fff9ea',furShadow:'#e9d5bc',ear:'#ecd7c6',earPink:'#e9b5bb',cheek:'#f6b0af',eye:'#17121f',eyeGlint:'#ffffff',nose:'#e890a4',noseHighlight:'#ffd5db',mouth:'#6e4051',tongue:'#ed9ba6',paw:'#f3e2cf',rug:'#e7abb9',rugIn:'#f9dfdf',wood:'#f5dfcb',wall:'#fff3e8',wallPanel:'#fce6d8',bed:'#cfa9c9',bedIn:'#f9e2f0',bowl:'#a3d0c1',bowlIn:'#82b3ac',ball:'#b19fe4',door:'#dec1a7',brown:'#947565',cream:'#fff7e8',frame:'#d9b7a9',mint:'#bedfd1',creamDark:'#c8a696',blue:'#bcd9ee',transparent:'#ffffff'};
function mesh(gl, data){const vbo=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vbo);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);return {vbo,count:data.length/6};}
function sphereData(L=34,B=22){const v=[];for(let y=0;y<B;y++){const a0=y/B*PI,a1=(y+1)/B*PI;for(let x=0;x<L;x++){const b0=x/L*2*PI,b1=(x+1)/L*2*PI;const p=(a,b)=>[Math.sin(a)*Math.cos(b),Math.cos(a),Math.sin(a)*Math.sin(b)];const p00=p(a0,b0),p01=p(a0,b1),p10=p(a1,b0),p11=p(a1,b1);for(let d of [p00,p10,p11,p00,p11,p01])v.push(...d,...d);}}return v;}
function boxData(){const v=[];const quads=[[[1,0,0],[[1,-1,-1],[1,1,-1],[1,1,1],[1,-1,1]]],[[-1,0,0],[[-1,-1,1],[-1,1,1],[-1,1,-1],[-1,-1,-1]]],[[0,1,0],[[-1,1,-1],[-1,1,1],[1,1,1],[1,1,-1]]],[[0,-1,0],[[-1,-1,1],[-1,-1,-1],[1,-1,-1],[1,-1,1]]],[[0,0,1],[[1,-1,1],[1,1,1],[-1,1,1],[-1,-1,1]]],[[0,0,-1],[[-1,-1,-1],[-1,1,-1],[1,1,-1],[1,-1,-1]]]];for(const [n,p] of quads)for(let i of [0,1,2,0,2,3])v.push(...p[i],...n);return v;}
function torusData(){const v=[],A=44,B=10;const p=(a,b)=>{const u=1+Math.cos(b)*.12;return [Math.cos(a)*u,Math.sin(b)*.12,Math.sin(a)*u]};const n=(a,b)=>norm([Math.cos(a)*Math.cos(b),Math.sin(b),Math.sin(a)*Math.cos(b)]);for(let i=0;i<A;i++)for(let j=0;j<B;j++){const a=i/A*2*PI,b=j/B*2*PI,aa=(i+1)/A*2*PI,bb=(j+1)/B*2*PI;for(const [x,y] of [[a,b],[a,bb],[aa,bb],[a,b],[aa,bb],[aa,b]])v.push(...p(x,y),...n(x,y));}return v;}
function furData(count=1600){const v=[],r=rand(883);for(let i=0;i<count;i++){const u=r()*2-1,a=r()*PI*2,s=Math.sqrt(1-u*u),n=[s*Math.cos(a),u,s*Math.sin(a)],basis=norm(cross(n,Math.abs(u)>.9?[1,0,0]:[0,1,0])),root=mul(n,1.003),p1=add(root,mul(basis,-.012-r()*.014)),p2=add(root,mul(basis,.012+r()*.014)),tip=add(root,mul(n,.05+r()*.09));const nn=norm(add(n,mul(basis,(r()-.5)*.4)));v.push(...p1,...nn,...p2,...nn,...tip,...nn);}return v;}
const vertex=`#version 300 es
precision highp float;
layout(location=0) in vec3 aPosition;
layout(location=1) in vec3 aNormal;
uniform mat4 uProjectionView;
uniform mat4 uModel;
out vec3 vNormal;
out vec3 vWorld;
out vec3 vLocal;
void main(){vec4 w=uModel*vec4(aPosition,1.0);vWorld=w.xyz;vLocal=aPosition;vNormal=normalize(mat3(uModel)*aNormal);gl_Position=uProjectionView*w;}`;
const fragment=`#version 300 es
precision highp float;
in vec3 vNormal;in vec3 vWorld;in vec3 vLocal;
uniform vec4 uColor;uniform float uGloss;uniform float uFur;uniform vec3 uEye;
out vec4 fragColor;
float hash(vec3 x){return fract(sin(dot(x,vec3(127.1,311.7,74.7)))*43758.5453);}
void main(){vec3 n=normalize(vNormal);vec3 l=normalize(vec3(-0.48,0.95,0.58));float nd=max(dot(n,l),0.0);float diffuse=0.65+nd*0.31;float hemi=0.08*(n.y+1.0);float pattern=hash(floor(vLocal*178.0));float furRough=(pattern-.5)*0.085*uFur;vec3 color=uColor.rgb*(diffuse+hemi+furRough);vec3 v=normalize(uEye-vWorld);vec3 h=normalize(l+v);float spec=pow(max(dot(n,h),0.0),mix(17.0,75.0,uGloss))*uGloss*.68;color+=vec3(1.0,.96,.95)*spec;float rim=pow(1.0-max(dot(v,n),0.0),2.8)*0.12;color+=vec3(1.0,.89,.87)*rim;fragColor=vec4(color,uColor.a);}`;
function compile(gl,type,src){const sh=gl.createShader(type);gl.shaderSource(sh,src);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(sh));return sh;}
function program(gl){const p=gl.createProgram();gl.attachShader(p,compile(gl,gl.VERTEX_SHADER,vertex));gl.attachShader(p,compile(gl,gl.FRAGMENT_SHADER,fragment));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));return p;}
export class MimoScene {
  constructor(canvas){this.canvas=canvas;const gl=canvas.getContext('webgl2',{antialias:true,alpha:false,premultipliedAlpha:false});if(!gl)throw new Error('Este navegador não disponibilizou WebGL2');this.gl=gl;this.program=program(gl);gl.useProgram(this.program);this.uniform={pv:gl.getUniformLocation(this.program,'uProjectionView'),model:gl.getUniformLocation(this.program,'uModel'),color:gl.getUniformLocation(this.program,'uColor'),gloss:gl.getUniformLocation(this.program,'uGloss'),fur:gl.getUniformLocation(this.program,'uFur'),eye:gl.getUniformLocation(this.program,'uEye')};this.meshes={sphere:mesh(gl,sphereData()),box:mesh(gl,boxData()),torus:mesh(gl,torusData()),fur:mesh(gl,furData())};this.camera=[4.7,3.3,7.6];this.aim=[0,1.1,-.2];this.fov=.76;this.aspect=1;gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.disable(gl.CULL_FACE);this.resize();this.tick=0;}
  resize(){const dpr=Math.min(window.devicePixelRatio||1,1.7),w=Math.max(2,Math.round(this.canvas.clientWidth*dpr)),h=Math.max(2,Math.round(this.canvas.clientHeight*dpr));if(this.canvas.width!==w||this.canvas.height!==h){this.canvas.width=w;this.canvas.height=h;this.gl.viewport(0,0,w,h);}this.aspect=w/h;const pv=mm(persp(this.fov,this.aspect,.1,80),lookAt(this.camera,this.aim));this.gl.useProgram(this.program);this.gl.uniformMatrix4fv(this.uniform.pv,false,pv);this.gl.uniform3fv(this.uniform.eye,this.camera);}
  draw(type,m,color,gloss=0,fur=0,alpha=1){const gl=this.gl,mh=this.meshes[type],c=hex(C[color]||color);gl.uniformMatrix4fv(this.uniform.model,false,m);gl.uniform4f(this.uniform.color,c[0],c[1],c[2],alpha);gl.uniform1f(this.uniform.gloss,gloss);gl.uniform1f(this.uniform.fur,fur);gl.bindBuffer(gl.ARRAY_BUFFER,mh.vbo);gl.enableVertexAttribArray(0);gl.enableVertexAttribArray(1);gl.vertexAttribPointer(0,3,gl.FLOAT,false,24,0);gl.vertexAttribPointer(1,3,gl.FLOAT,false,24,12);gl.drawArrays(gl.TRIANGLES,0,mh.count);}
  oval(parent,xyz,scale,color,opts={}){const m=chain(parent,T(...xyz),opts.rx?RX(opts.rx):I(),opts.ry?RY(opts.ry):I(),opts.rz?RZ(opts.rz):I(),S(...scale));this.draw('sphere',m,color,opts.gloss||0,opts.furry?1:0,opts.alpha??1);if(opts.furry)this.draw('fur',m,color,0,1);return m;}
  cuboid(parent,xyz,scale,color,opts={}){const m=chain(parent,T(...xyz),opts.ry?RY(opts.ry):I(),S(...scale));this.draw('box',m,color,opts.gloss||0,0,opts.alpha??1);return m;}
  torus(parent,xyz,scale,color){this.draw('torus',chain(parent,T(...xyz),S(...scale)),color)}
  background(t){const gl=this.gl;this.cuboid(I(),[0,-.17,0],[8,.17,8],'wood');this.cuboid(I(),[0,2,-4.7],[7.7,2.4,.12],'wall');this.cuboid(I(),[-6.6,1.8,0],[.13,2.4,6],'wallPanel');this.cuboid(I(),[0,.06,-4.56],[7,.07,.045],'frame');
    // Quadro e janela de fundo, para dar profundidade.
    this.cuboid(I(),[-2.8,2.65,-4.49],[.94,.83,.035],'frame');this.cuboid(I(),[-2.8,2.65,-4.43],[.84,.72,.045],'blue');this.cuboid(I(),[-2.8,2.65,-4.38],[.044,.72,.05],'cream');this.cuboid(I(),[-2.8,2.65,-4.38],[.84,.044,.05],'cream');
    this.cuboid(I(),[2.62,1.65,-4.48],[.9,1.62,.09],'door');this.cuboid(I(),[2.62,1.7,-4.39],[.7,1.45,.025],'wallPanel');this.oval(I(),[3.16,1.65,-4.32],[.065,.065,.065],'brown',{gloss:.65});
    // Tapete de sala + bordas.
    this.oval(I(),[0,-.008,.18],[3.48,.068,2.88],'rugIn');this.torus(I(),[0,.031,.18],[3.44,.7,2.87],'rug');
    // Cama com almofada oval.
    this.oval(I(),[-2.45,.13,-1.5],[1.2,.22,.88],'bed');this.oval(I(),[-2.45,.24,-1.45],[1.02,.16,.7],'bedIn');
    // Tigela de comida.
    this.oval(I(),[2.35,.1,1.6],[.53,.15,.48],'bowl');this.oval(I(),[2.35,.23,1.6],[.39,.035,.35],'bowlIn');this.torus(I(),[2.35,.21,1.6],[.49,.68,.44],'mint');
    // Bolinha e estrelinhas.
    this.oval(I(),[-2.43,.36,1.22],[.33,.33,.33],'ball',{gloss:.15});this.oval(I(),[-2.48,.38,1.50],[.14,.11,.045],'cream');
    // Pequenas plantinhas laterais.
    this.cuboid(I(),[4.8,.25,-2.3],[.4,.24,.4],'frame');for(const [x,z] of [[4.8,-2.3],[4.65,-2.24],[4.95,-2.3]])this.oval(I(),[x,.8,z],[.18,.5,.15],'mint',{rz:(x-4.8)*1.3});
  }
  dog(state,t){const phase=state.stage||3;const grow=(phase-1)/9;const g=.62+grow*.46;const motion=state.motion||'idle';const move=(motion==='walk'||motion==='run');const run=motion==='run';const seconds=t;const gait=seconds*(run?16:9);const gaitAmount=move?(run?.65:.43):.055;const bounce=move?(.045+Math.abs(Math.sin(gait))* (run?.11:.05)):Math.sin(seconds*2)*.015;
    const sit=motion==='sit'||motion==='feed'||motion==='pet'||motion==='guard'||motion==='sleep';const sleep=motion==='sleep';const guarded=motion==='guard';const shake=motion==='shake';const shakeAngle=shake?Math.sin(seconds*44)*.1:0;const bodyDrop=sit?-.13:0;const root=chain(T(state.x||0,bounce-.06,state.z||0),RY((state.yaw||0)+shakeAngle),S(g,g,g));
    // Sombra alinhada ao corpo.
    this.oval(I(),[state.x||0,.025,state.z||0],[.8*g,.013,1.2*g],'creamDark',{alpha:.18});
    const b=chain(root,T(0,bodyDrop,0));
    const bodySway=move?Math.sin(gait)*.035:Math.sin(seconds*1.1)*.013;
    const torso=chain(b,RY(bodySway));
    this.oval(torso,[0,1.0,-.19],[.64,.65,.88],'fur',{furry:true,rx:sit?.24:0});
    // peito sob a cabeça, profundidade real
    this.oval(torso,[0,.99,.51],[.58,.53,.55],'furLight',{furry:true});
    // Patas de trás e frente possuem oscilação desencontrada em trote diagonal.
    for(let i=0;i<4;i++){
      const left=i%2===0,front=i<2,x=left?-.46:.46,z=front?.5:-.75;
      const diag=(i===0||i===3)?0:PI;
      const stride=move?Math.sin(gait+diag)*gaitAmount:(Math.sin(seconds+i)*.025);
      const lift=move?Math.pow(Math.max(0,Math.cos(gait+diag)),2)*(run?.24:.11):0;
      const upper=chain(b,T(x,front?.82:.75,z),RX(stride+(front?.04:-.20)),RZ((left?-1:1)*.035));
      const l=front?.43:.40;
      this.oval(upper,[0,-l*.37,0],[front?.19:.26,l*.75,front?.22:.27],'fur',{furry:true});
      const knee=chain(upper,T(0,-l*.70,0),RX((front?-.10:.30)+(move?Math.max(0,Math.cos(gait+diag))*-.40:0)));
      this.oval(knee,[0,-.15+lift,front?.065:-.045],[.18,.22,.205],'furLight',{furry:true});
      this.oval(knee,[0,-.28+lift,.1],[.245,.14,.30],'paw',{furry:true});
      // separação delicada das almofadinhas só se visível.
    }
    // Rabinho balançando como cachorrinho real.
    const wag=Math.sin(seconds*(motion==='pet'||motion==='play'?18:motion==='guard'?5:8))*(guarded?.09:.42);
    const tail=chain(torso,T(0,1.17,-.94),RY(wag),RX(-.35+Math.sin(seconds*4)*.09));
    this.oval(tail,[0,.11,-.21],[.20,.23,.34],'fur',{furry:true,rx:-.6});
    this.oval(tail,[0,.29,-.39],[.22,.24,.22],'furLight',{furry:true});
    // Cabeça grande, bochechas e orelhas molinhas.
    const headBob=move?Math.sin(gait+1)*.046:Math.sin(seconds*1.6)*.012;
    const headTilt=motion==='sniff'?.19:motion==='call'?-.17:motion==='guard'?-.08:Math.sin(seconds*.66)*.035;
    const head=chain(torso,T(0,sleep?1.20:1.65, .64),RZ(headTilt),RX((guarded?-.04:0)+(sleep?.33:0)+headBob));
    const earSwing=move?Math.sin(gait+1.3)*.19:Math.sin(seconds*2)*.035;
    for(let side of [-1,1]){
      const ear=chain(head,T(side*.65,.22,-.08),RZ(side*(.18+earSwing)));
      const earScale=.75+grow*.35;
      this.oval(ear,[side*.08,-.30,0],[.25*earScale,.43*earScale,.28*earScale],'ear',{furry:true,rz:side*.18});
      this.oval(ear,[side*.10,-.34,.232],[.14,.26,.06],'earPink');
    }
    this.oval(head,[0,0,0],[.77,.72,.69],'fur',{furry:true});
    this.oval(head,[0,-.25,.31],[.69,.42,.46],'furLight',{furry:true});
    for(let side of [-1,1]){
      this.oval(head,[side*.47,-.28,.46],[.34,.28,.29],'furLight',{furry:true});
      this.oval(head,[side*.52,-.28,.66],[.18,.09,.035],'cheek',{alpha:.62});
      // Olhos negros enormes e reflexos; recém-nascido quase dormindo.
      const eyeY=.13,eyeX=side*.29,eyeZ=.615;
      if(phase===1){this.oval(head,[eyeX,eyeY,eyeZ],[.18,.045,.049],'mouth');}
      else {const eyeOpen=phase===2?.15:.235;this.oval(head,[eyeX,eyeY,eyeZ],[eyeOpen,eyeOpen*1.12,.16],'eye',{gloss:1});this.oval(head,[eyeX-.07,eyeY+.08,eyeZ+.137],[.070,.078,.025],'eyeGlint',{gloss:.6});this.oval(head,[eyeX+.069,eyeY-.055,eyeZ+.139],[.023,.027,.016],'eyeGlint');}
    }
    // focinho rosa e boca, sem focinho humano.
    this.oval(head,[-.18,-.31,.64],[.245,.17,.26],'furLight',{furry:true});
    this.oval(head,[ .18,-.31,.64],[.245,.17,.26],'furLight',{furry:true});
    this.oval(head,[0,-.245,.84],[.14,.10,.085],'nose',{gloss:.4});
    this.oval(head,[-.046,-.205,.915],[.034,.017,.010],'noseHighlight',{gloss:.9});
    const pant=motion==='play'||motion==='guard'||motion==='call';
    this.oval(head,[0,-.40,.804],[pant?.15:.055,pant?.14:.034,.018],'mouth');
    if(pant&&!guarded)this.oval(head,[0,-.49,.824],[.087,.09,.027],'tongue',{gloss:.22});
    if(guarded&&phase>=5){this.oval(head,[0,-.41,.81],[.17,.07,.03],'mouth');this.oval(head,[-.082,-.394,.84],[.047,.046,.032],'cream');this.oval(head,[.082,-.394,.84],[.047,.046,.032],'cream');}
    if(state.wet>12){for(let i=0;i<3;i++){const angle=seconds*1.6+i*2.1;const x=Math.cos(angle)*.85;const y=1.4+Math.sin(angle*1.2)*.42;this.oval(b,[x,y,.38],[.05,.09,.05],'blue',{alpha:.5});}}
    if(motion==='sleep')for(let i=0;i<3;i++){this.oval(b,[.8+i*.18,2.2+i*.16,.7],[.03+i*.017,.035+i*.017,.03],'blue',{alpha:.65});}
    return {g};
  }
  render(state,time){this.resize();const gl=this.gl;gl.clearColor(1,.952,.93,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(this.program);this.background(time);this.dog(state,time);}
  floorPoint(clientX,clientY){const r=this.canvas.getBoundingClientRect();const x=((clientX-r.left)/r.width)*2-1;const y=(1-(clientY-r.top)/r.height)*2-1;const forward=norm(sub(this.aim,this.camera)),right=norm(cross(forward,[0,1,0])),up=norm(cross(right,forward));const aspect=r.width/r.height,s=Math.tan(this.fov/2);const dir=norm(add(forward,add(mul(right,x*s*aspect),mul(up,y*s))));if(dir[1]>=-.00001)return null;const dist=(0-this.camera[1])/dir[1];const p=add(this.camera,mul(dir,dist));return {x:clamp(p[0],-3.8,3.8),z:clamp(p[2],-3.1,3.1)};}
}