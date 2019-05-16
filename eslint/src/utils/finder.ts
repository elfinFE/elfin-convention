import "vue-eslint-parser"
import { ESLintProgram, ESLintExportDefaultDeclaration } from 'vue-eslint-parser/ast';
import { isExportDefaultDeclaration } from './asserts';

export function findDefaultExportObject(program: ESLintProgram): ESLintExportDefaultDeclaration | undefined {
    const body = program.body

    for(const ele of body){
        if(isExportDefaultDeclaration(ele)) {
            return ele
        }
    }

    return
}
