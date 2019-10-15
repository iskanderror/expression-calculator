/* Inspired by https://www.freecodecamp.org/news/parsing-math-expressions-with-javascript-7e8f5572276e/ */

function eval() {
    // Do not use eval!!!
    return;
}

const separatorsExpr = /[-+/*()]/g;
const precedence = {'*' : 3,  '/' : 3,  '+' : 1,  '-' : 2 };
/*association array not needed because all operations are left-associative*/


/*assume that expression is valid */
function expressionCalculator(expr) {
  let tokenizedExpr = tokenize(expr);
  let postfixExpr = tokensToRPN(tokenizedExpr);
  let result = computeRPN(postfixExpr);
  return result;
}

function computeRPN(postfixExpr) {
  let exprToCompute = postfixExpr.reverse();
  let args = [];
  while (exprToCompute.length>0){
    let token = exprToCompute.pop();
    if (precedence[token]!==undefined) {
      let arg2 = args.pop();
      let arg1 = args.pop();
      args.push(computeBinary(arg1,arg2,token));
    } else {
      args.push(token);
    }
  }
  return args[0];
}

/* Implements a shunting yard algorithm */
/* 
While there are tokens to be read:
1. Read a token. Let’s call it t
2. If t is a Variable, push it to the output queue.
3. If t is an Operator:
  a. while there is an Operator token o at the top of the operator stack and either t is left-associative (all of us) and has precedence is less than or equal to that of o, 
    or t is right associative (none, not implemented), and has precedence less than that of o, pop o off the operator stack, onto the output queue;
  b. at the end of iteration push t onto the operator stack.
6. If the token is a Left Parenthesis, push it onto the stack.
7. If the token is a Right Parenthesis, pop operators off the stack onto the output queue until the token at the top of the stack is a left parenthesis. 
    Then pop the left parenthesis from the stack, but not onto the output queue.
When there are no more tokens to read, pop any Operator tokens on the stack onto the output queue.
*/
function tokensToRPN(tokenizedExpr) {
  let operatorsStack=[];
  let outputQueue=[];
  for (let i=0;i<tokenizedExpr.length;i++){
    let token = tokenizedExpr[i];
    if (precedence[token]!==undefined){
      for (let j=0; j<operatorsStack.length;j++){
        let topToken = operatorsStack.pop();
        if (precedence[topToken]===undefined) {
          operatorsStack.push(topToken);
          break;
        }
        if(precedence[token]<=precedence[topToken]){
          outputQueue.push(topToken);
        }
        else {
          operatorsStack.push(topToken);
          break;
        }
      }
      operatorsStack.push(token);
      continue;
    }
    if (token == '('){
      operatorsStack.push(token);
      continue;
    }
    if (token == ')'){
      if (!operatorsStack.includes('(')){ 
        throw new Error("ExpressionError: Brackets must be paired");
      }
      for (let j=0; j<operatorsStack.length;j++){
        let topToken = operatorsStack.pop();
        if (topToken == '(') {
          break;
        }
        outputQueue.push(topToken);
      }
      continue;
    }
    outputQueue.push(token);
  }
  if (operatorsStack.includes('(')){ 
    throw new Error("ExpressionError: Brackets must be paired");
  }
  while (operatorsStack.length>0){
    let topToken = operatorsStack.pop();
    outputQueue.push(topToken);
  }
  return outputQueue;
}

function computeBinary (arg1,arg2, operator){
  switch(operator) {
    case '+':
      return Number(arg1) + Number(arg2);
    case '-':
      return Number(arg1) - Number(arg2);
    case '/':
      if(Number(arg2)==0) {
        throw new TypeError("TypeError: Division by zero.");
      }
      return Number(arg1)/Number(arg2);
    case '*':
      return Number(arg1)*Number(arg2);
  }
}

function tokenize (expr){
  let preparedExpr = expr.replace(separatorsExpr, match => '$' + match + '$');
  let tokenizedExpr = preparedExpr.split('$');
  tokenizedExpr = tokenizedExpr.map(function(e){return e.trim();});
  tokenizedExpr = tokenizedExpr.filter(function(e){return e!="";});
  return tokenizedExpr;
}


//module.exports = {expressionCalculator}

expressionCalculator( " 20 - 57 * 12 - (  58 + 84 * 32 / 27  ) ");