# 🐾 MIMO — Your Little Friend | BETA WEB 3D

**Protótipo local e gratuito** inspirado nas imagens do ZIP MIMO enviado pelo criador. O objetivo é testar a movimentação e o comportamento de um filhotinho virtual antes de modelar o MIMO definitivo em Blender.

## Iniciar no Windows (1 clique)

1. Extraia o ZIP para uma pasta, por exemplo `C:\Users\nobody\Downloads\MIMO_BETA_WEB`.
2. Dê dois cliques em **`INICIAR_MIMO.bat`**.
3. O jogo abre no navegador em **http://localhost:8765**.
4. Mantenha a janela preta aberta enquanto estiver jogando ou testando no celular.

**Requisito do servidor:** ter Node.js ou Python instalado. Não é necessário npm install, Unity, Unreal, Godot, nuvem, conta, pagamento ou conexão com a Internet.

## Acessar no iPhone durante o beta

Conecte iPhone e PC ao **mesmo Wi-Fi**. O servidor mostra no terminal o endereço `http://IP-DO-PC:8765`, que pode ser digitado no Safari do iPhone. Caso não abra, libere a porta 8765 na Firewall do Windows na **rede privada**; não abra a porta no roteador e não exponha esse servidor à Internet. O endereço pode mudar de acordo com sua rede.

**Importante:** em iOS, offline completo ao desconectar do PC não é garantido quando o app é servido por endereço HTTP da rede local. Para PWA offline no iPhone será necessária uma origem HTTPS confiável ou pacote nativo futuramente. Em `localhost` no computador, o cache offline funciona em navegadores compatíveis depois do primeiro acesso; o servidor pode ser parado e o navegador pode servir a versão cacheada. Os dados ficam no armazenamento local de **cada navegador/dispositivo**, não sincronizados entre eles.

## Testar

- **Toque no chão**: Mimo caminha em quatro patinhas até lá.
- **Dois toques rápidos**: Mimo corre.
- **W/A/S/D e setas**: movimento no computador.
- **Comida**: ele vai à tigela, se alimenta e melhora a fome.
- **Brincar**: ele corre para a bolinha.
- **Carinho**: abana o rabinho e reage ao toque.
- **Banho**: aumenta a limpeza, mas ele fica molhado e reclama.
- **Secar**: toalha, sacudida e melhora do humor.
- **Dormir**: entra e sai do descanso, recuperando energia.
- **Chamar**: simulação pelo botão (ainda não usa microfone); Mimo vem correndo.
- **Proteger**: late, e nas fases mais crescidas rosna para proteger a casinha.
- **Fases 1–10**: **prévia procedural** de tamanho/proporção, ainda não os modelos finais.
- **Som**: ativado depois da primeira interação por política de navegadores, gerado via Web Audio sem arquivos externos.
- **Progresso**: salvo automaticamente via localStorage (não apague os dados do site se quiser preservar a evolução do beta).

## Escopo e limitações honestas

**Já funcional:** um bichinho em 3D real, renderizado em WebGL2, corpo volumétrico, patas animadas com trote diagonal, orientação em direção ao movimento, correr/caminhar, cabeça, orelhas e rabinho animados, necessidades, ações, sons sintetizados, movimento por teclado/toque, salvamento e interface responsiva. Sem bibliotecas externas, sem CDN, sem API paga.

**Ainda não feito:** personagem 3D fiel à foto, pelo cinematográfico de Blender, rigging profissional, animações por captura de movimento, 10 modelos anatômicos separados, IA Ollama real, reconhecimento local de voz por microfone, sincronização de progresso entre dispositivos, sincronização com servidor e publicação na App Store. A pelagem do modelo atual é **uma aproximação procedural**, não um asset 3D definitivo. A fase exibida no controle é demonstração, não crescimento automático por dias reais.

## Próximas fases recomendadas

1. Criar no Blender um único MIMO fiel à foto com malha orgânica, texturas, rig e pelo otimizado para celular (GLB/glTF).
2. Substituir o modelo procedural e criar animações `idle`, `walk`, `run`, `sit`, `lie`, `sleep`, `shake`, `bark`, `growl`, `sniff`, `eat`, `pet` com pés apoiados no chão e transições suaves.
3. Criar modelos para as dez fases em um único rig evolutivo, com seis materiais de pelagem.
4. Integrar microfone com consentimento e reconhecimento local de palavra-chave (para dispositivos que suportarem), com fallback do botão.
5. Avaliar Godot 4 para versões iPhone nativas se o jogo evoluir além do beta web.

## Segurança / privacidade

Servidor apenas de arquivos estáticos, sem autenticação e sem painel admin; por isso **usar somente em rede local confiável**. Não compartilhe a porta publicamente. O beta não acessa microfone, câmera, arquivos pessoais nem envia dados. Zero telemetria. Os recursos de áudio são sintéticos. As imagens na pasta `assets/` foram fornecidas pelo criador e usadas apenas como referências visuais.

**Compatibilidade:** Chrome e Edge atuais no PC; Safari com WebGL2 no iPhone. Em aparelhos antigos ou com aceleração gráfica desativada, o renderizador pode não abrir.

### Beta 0.2 — correção do início
O Mimo inicia na fase 1 (**Newborn**) com um corpo visivelmente menor. No primeiro acesso à nova versão, dados antigos que estavam na fase padrão 3 passam para 1 uma única vez, sem apagar fome, energia, higiene, felicidade nem diário. As outras fases continuam preservadas. O novo botão **Voltar ao recém-nascido** retorna à fase 1 sem apagar os cuidados. O cache offline passa a priorizar a versão mais recente quando o servidor estiver online.
