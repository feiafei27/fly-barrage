import { execa } from 'execa';
import enquirer from 'enquirer';
import pico from 'picocolors';

const run = (bin, args, opts = {}) =>
    execa(bin, args, { stdio: 'inherit', ...opts });

async function main() {
    const { message } = await enquirer.prompt({
        type: 'input',
        name: 'message',
        message: 'Please input commit message:',
    });

    if (!message) {
        console.log(pico.red('请输入 commit message'))
        return;
    }

    await run('git', ['add', '-A']);
    await run('git', ['commit', '-m', message]);

    const remotes = [
        'git@github.com:feiafei27/fly-barrage.git',
        'https://gitee.com/fei_fei27/fly-barrage.git',
    ];

    await Promise.all(remotes.map(remote => run('git', ['push', remote])));
}

main().then(r => {});
