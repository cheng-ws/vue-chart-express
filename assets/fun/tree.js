let tree = [
    {
        id: '1',
        title: '节点1',
        children: [
            {
                id: '1-1',
                title: '节点1-1'
            },
            {
                id: '1-2',
                title: '节点1-2'
            }
        ]
    },
    {
        id: '2',
        title: '节点2',
        children: [
            {
                id: '2-1',
                title: '节点2-1'
            }
        ]
    }
];
// 广度优先
function treeForeach (tree, func) {
    let node, list = [...tree];
    console.log(list.shift());
    while (node = list.shift()) {
        func(node);
        node.children && list.push(...node.children)
    }
}
treeForeach(tree, node=>{console.log(node.title)});
// 深度优先遍历
// 先序
function treeForeach (tree, func) {
  tree.forEach(data =>{
      func(data);
      data.children && treeForeach(data.children, func); //遍历子树
  });
}
//后序
function treeAfter (tree, func) {
   tree.forEach(data=>{
       data.children && treeAfter(data.children, func); //遍历子树
       func(data);
   });
}
treeForeach(tree, node=>{console.log(node.title)});
treeAfter(tree, node=>{console.log(node.title)});
