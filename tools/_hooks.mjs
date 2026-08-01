// Liga a trava de push nesta máquina, sozinha.
//
// `core.hooksPath` é configuração LOCAL: não vem no clone. Num PC novo (ou no MacBook)
// o hook estaria no repo e mesmo assim não rodaria — falha calada, que é justamente o
// tipo de coisa que a trava existe para evitar.
//
// Por isso todas as ferramentas do projeto chamam isto na largada: quem rodar
// gen-produtos, serve ou a auditoria já sai com a trava ligada, em Windows ou macOS.
import { execFileSync } from 'node:child_process';

export function garantirHooks() {
  const git = (args) =>
    execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();

  try {
    if (git(['rev-parse', '--is-inside-work-tree']) !== 'true') return;
  } catch {
    return; // sem git na máquina, ou pasta não é repo: não é problema nosso aqui
  }

  let atual = '';
  try { atual = git(['config', 'core.hooksPath']); } catch { /* não configurado */ }
  if (atual === '.githooks') return;

  try {
    git(['config', 'core.hooksPath', '.githooks']);
    console.log('🔒 Trava de publicação ligada nesta máquina (core.hooksPath = .githooks).');
  } catch {
    console.log('⚠ Não consegui ligar a trava de publicação. Rode à mão: git config core.hooksPath .githooks');
  }
}
