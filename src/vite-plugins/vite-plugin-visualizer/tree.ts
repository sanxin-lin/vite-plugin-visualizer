import ModuleMapper from "./mapper";

interface INode {
  name: string;
  children: INode[];
  value?: number;
  uid?: string;
}

const isModuleTree = (node: INode) => node.children;

const addPath = (moduleId: string, tree: INode, path: string[], node: any) => {
  if (path.length === 0) {
    throw new Error(`Error adding node to path ${moduleId}`);
  }
  const [name, ...rest] = path;

  if (rest.length === 0) {
    tree.children.push({ ...node, name });
    return;
  }

  let _tree = tree.children.find(
    (folder) => folder.name === name && isModuleTree(folder)
  );

  if (!_tree) {
    _tree = { name, children: [] };
    tree.children.push(_tree);
  }
  addPath(moduleId, _tree, rest, node);
};

const mergeSingleChildTrees = (tree: INode): INode => {
  if (tree.children.length === 1) {
    const child = tree.children[0];
    const name = `${tree.name}/${child.name}`;
    if (isModuleTree(child)) {
      tree.name = name;
      tree.children = child.children;
      return mergeSingleChildTrees(tree);
    } else {
      return {
        name,
        uid: child.uid,
        value: child.value,
      } as INode;
    }
  } else {
    tree.children = tree.children.map((node: any) => {
      if (isModuleTree(node)) {
        return mergeSingleChildTrees(node);
      } else {
        return node;
      }
    });
    return tree;
  }
};

export const buildTree = (
  bundleId: string,
  modules: any[],
  mapper: ModuleMapper
) => {
  const tree: INode = {
    name: bundleId,
    children: [],
  };
  for (const { id, length } of modules) {
    const bundleModuleUID = mapper.setNodePart(bundleId, id, { length });
    const trimmedModuleId = mapper.trimProjectRootId(id);

    const pathParts = trimmedModuleId.split("/").filter((p) => p !== "");
    addPath(trimmedModuleId, tree, pathParts, {
      uid: bundleModuleUID,
      value: length,
    });
  }

  tree.children = tree.children.map((node) => {
    if (isModuleTree(node)) {
      return mergeSingleChildTrees(node);
    } else {
      return node;
    }
  });

  return tree
};
