interface INodeMeta<T> {
  id: string;
  bundleIdMap: Record<string, string>;
  imported: T;
  importedBy: T;
  isEntry?: boolean;
  isExternal?: boolean;
}

type NodeMetaMap = Record<
  string,
  {
    uid: string;
    meta: INodeMeta<Set<string>>;
  }
>;

// 导入相关类型和函数
const getUid = (alphabit: string, size: number) => () => {
  let result = "";
  for (let i = 0; i < size; i++) {
    result += alphabit[(Math.random() * alphabit.length) | 0];
  }
  return result;
};
// 生成唯一前缀
const nanoid = getUid("sunshine", 6);
const UNIQUE_PREFIX = nanoid();
let counter = 0;

// 生成唯一 ID
const uniqueId = () => `${UNIQUE_PREFIX}-${counter++}`;

class ModuleMapper {
  private projectRoot: string;
  private nodePartMap: NodeMetaMap = {};
  private nodeMetaMap: NodeMetaMap = {};

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }

  trimProjectRootId(moduleId: string) {
    let str = ''
    if (moduleId.startsWith(this.projectRoot)) {
      str = moduleId.slice(this.projectRoot.length);
    }
    str = moduleId.replace(this.projectRoot, "");

    return str.trim()
  }

  getModuleUID(moduleId: string) {
    if (!this.nodeMetaMap[moduleId]) {
      this.nodeMetaMap[moduleId] = {
        uid: uniqueId(),
        meta: {
          id: this.trimProjectRootId(moduleId),
          bundleIdMap: {},
          imported: new Set(),
          importedBy: new Set(),
        },
      };
    }
    return this.nodeMetaMap[moduleId].uid;
  }

  getBundleModuleUID(bundleId: string, moduleId: string) {
    if (!this.nodeMetaMap[moduleId]) {
      this.nodeMetaMap[moduleId] = {
        uid: uniqueId(),
        meta: {
          id: this.trimProjectRootId(moduleId),
          bundleIdMap: {},
          imported: new Set(),
          importedBy: new Set(),
        },
      };
    }
    if (!this.nodeMetaMap[moduleId].meta.bundleIdMap[bundleId]) {
      this.nodeMetaMap[moduleId].meta.bundleIdMap[bundleId] = uniqueId();
    }

    return this.nodeMetaMap[moduleId].meta.bundleIdMap[bundleId];
  }

  setNodePart(bundleId: string, moduleId: string, value: any) {
    const uid = this.getBundleModuleUID(bundleId, moduleId);
    if (this.nodePartMap[uid]) {
      throw new Error(
        `Override module: bundle id ${bundleId}, module id ${moduleId}, value ${JSON.stringify(
          value
        )}, existing value: ${JSON.stringify(this.nodePartMap[uid])}`
      );
    }
    this.nodePartMap[uid] = { ...value, metaUid: this.getModuleUID(moduleId) };

    return uid;
  }

  setNodeMeta(moduleId: string, value: any) {
    this.getModuleUID(moduleId);
    this.nodeMetaMap[moduleId].meta.isEntry = value.isEntry;
    this.nodeMetaMap[moduleId].meta.isExternal = value.isExternal;
  }

  hasNodePart(bundleId: string, moduleId: string) {
    return (
      this.nodeMetaMap[moduleId] &&
      this.nodeMetaMap[moduleId].meta.bundleIdMap[bundleId] &&
      this.nodePartMap[this.nodeMetaMap[moduleId].meta.bundleIdMap[bundleId]]
    );
  }

  getNodePartMap() {
    return this.nodePartMap;
  }

  getNodeMetaMap() {
    const map: Record<
      string,
      INodeMeta<{ uid: string; dynamic: boolean }[]>
    > = {};
    for (const { uid, meta } of Object.values(this.nodeMetaMap)) {
      map[uid] = {
        ...meta,
        imported: [...meta.imported].map((importItem) => {
          const [uid, dynamic] = importItem.split(",");
          const importData = { uid, dynamic: false };
          if (dynamic === "true") {
            importData.dynamic = true;
          }
          return importData;
        }),
        importedBy: [...meta.imported].map((importItem) => {
          const [uid, dynamic] = importItem.split(",");
          const importData = { uid, dynamic: false };
          if (dynamic === "true") {
            importData.dynamic = true;
          }
          return importData;
        }),
      };
    }
    return map;
  }

  addImportedLink(targetId: string, sourceId: string) {
    const sourceUID = this.getModuleUID(sourceId);
    this.getModuleUID(targetId);
    this.nodeMetaMap[targetId].meta.imported.add(sourceUID);
  }

  addImportedByLink(targetId: string, sourceId: string) {
    const sourceUID = this.getModuleUID(sourceId);
    this.getModuleUID(targetId);
    this.nodeMetaMap[targetId].meta.importedBy.add(sourceUID);
  }
}


export default ModuleMapper