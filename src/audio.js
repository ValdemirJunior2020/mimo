// Sons originais por síntese Web Audio. Sem downloads, APIs, assinaturas ou gravações externas.
export class PuppyAudio {
  constructor(){this.ctx=null;this.enabled=true;}
  async wake(){if(!this.enabled)return;const AudioContext=window.AudioContext||window.webkitAudioContext;if(!AudioContext)return;this.ctx ||= new AudioContext();if(this.ctx.state==='suspended')await this.ctx.resume();}
  osc(type,freq,t,duration,vol=0.12,endFreq=freq){if(!this.ctx||!this.enabled)return;const ctx=this.ctx;const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(Math.max(30,freq),t);o.frequency.exponentialRampToValueAtTime(Math.max(30,endFreq),t+duration);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(0.001,vol),t+Math.min(.018,duration*.24));g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+duration+.015);}
  noise(t,duration,vol=.07){if(!this.ctx||!this.enabled)return;const ctx=this.ctx;const count=Math.ceil(duration*ctx.sampleRate),buffer=ctx.createBuffer(1,count,ctx.sampleRate),samples=buffer.getChannelData(0);for(let i=0;i<count;i++)samples[i]=(Math.random()*2-1)*(1-i/count);const src=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();f.type='lowpass';f.frequency.value=1350;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+duration);src.buffer=buffer;src.connect(f).connect(g).connect(ctx.destination);src.start(t);src.stop(t+duration+.01);}
  play(sound){if(!this.ctx||!this.enabled)return;const t=this.ctx.currentTime+.025;switch(sound){
    case 'bark':this.osc('triangle',470,t,.13,.15,190);this.noise(t,.1,.035);this.osc('sine',330,t+.17,.11,.1,200);break;
    case 'growl':this.osc('sawtooth',130,t,.57,.065,90);this.osc('triangle',73,t,.62,.06,85);this.noise(t,.58,.025);break;
    case 'whine':this.osc('sine',450,t,.42,.08,710);this.osc('triangle',660,t+.15,.4,.055,430);break;
    case 'happy':this.osc('sine',510,t,.12,.075,680);this.osc('sine',700,t+.1,.16,.08,550);break;
    case 'eat':for(let i=0;i<4;i++){this.osc('triangle',175+i*16,t+i*.16,.08,.045,120);this.noise(t+i*.16,.045,.01)}break;
    case 'water':for(let i=0;i<6;i++){this.osc('sine',400+i*69,t+i*.11,.16,.04,210+i*40);this.noise(t+i*.11,.08,.013)}break;
    case 'step':this.noise(t,.07,.012);this.osc('sine',95,t,.06,.023,60);break;
    case 'snore':this.osc('sine',135,t,.37,.025,84);break;
    case 'squeak':this.osc('sine',860,t,.15,.09,550);break;
    case 'magic':for(let i=0;i<4;i++)this.osc('sine',420+i*95,t+i*.13,.28,.065,760+i*110);break;
  }}
}