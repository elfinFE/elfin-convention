import {Rule} from 'eslint'
import {Node} from 'estree'
import {routesInfo} from './router-info'

class RouterChainTypeChecker implements Rule.RuleModule {
    meta: Rule.RuleMetaData = {}

    scriptWalker(node: Node) {
        console.info(routesInfo)
    }

    create(context: Rule.RuleContext): Rule.RuleListener {
        return {CallExpression: this.scriptWalker}
    }
}

export = new RouterChainTypeChecker()
