import { execa } from 'execa';
import enquirer from 'enquirer';
import pico from 'picocolors';

const run = (bin, args, opts = {}) =>
    execa(bin, args, { stdio: 'inherit', ...opts });

async function main() {
    // 定义所有的提交类型
    const commitTypes = [
        { type: 'feat', desc: '增加新功能' },
        { type: 'fix', desc: '修复bug' },
        { type: 'docs', desc: '文档相关' },
        { type: 'chore', desc: '不修改src或者test的其余修改，例如构建过程或辅助工具的变动' },
        { type: 'build', desc: '构造工具的或者外部依赖的改动' },
        { type: 'ci', desc: '（持续集成服务）配置文件和脚本有关的改动' },
        { type: 'perf', desc: '提高性能的改动' },
        { type: 'refactor', desc: '代码重构' },
        { type: 'style', desc: '不影响代码含义的改动，例如去掉空格、改变缩进、增删分号' },
        { type: 'test', desc: '增加或修正测试' },
    ];

    // 选择类型
    const { commitType } = await enquirer.prompt({
        type: 'select',
        name: 'commitType',
        message: 'Select commit type',
        choices: commitTypes.map(item => {
            const { type, desc } = item;

            return {
                name: type,
                message: `${type}: ${desc}`,
            };
        })
    })

    const { message } = await enquirer.prompt({
        type: 'input',
        name: 'message',
        message: 'Please input commit message:',
    });

    if (!message) {
        console.log(pico.red('请输入 commit message'))
        return;
    }

    const { yes } = await enquirer.prompt({
        type: 'confirm',
        name: 'yes',
        message: `commit message 是："${commitType}: ${message}"，确定提交吗？`
    })
    if (!yes) return;

    await run('git', ['add', '-A']);
    await run('git', ['commit', '-m', `${commitType}: ${message}`]);

    const remotes = [
        'git@github.com:feiafei27/fly-barrage.git',
        'https://gitee.com/fei_fei27/fly-barrage.git',
    ];

    await Promise.all(remotes.map(remote => run('git', ['push', remote])));
}

main().then(r => {});
