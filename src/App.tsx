import { useEffect, useContext, useState, useMemo } from "react";
import AppContext from "./appContext";
import Form from "./Components/Form";
import Sidebar from "./Components/Sidebar";
import ExtendedTree from './Components/Tree'
import { getNodes } from "./transportLayer";
import { NodeType } from "./types";
import { message } from "antd";

function App() {
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedItem, setSelectedItem] = useState(null);
  const [showEdit, setShowEdit] = useState(true);
  const [treeData, setTreeData] = useState<NodeType[]>([]);

  const fetchTreeData = async () => {
    const result = await getNodes();
    setTreeData(result);
  }

  useEffect(() => {
    fetchTreeData()
  }, [])

  const findItemByKey = (trees: NodeType[], nodeKey: string): NodeType | null => {
    for (const item of trees) {
      if (item.key === nodeKey) {
        return item; // Return the object if the key matches  
      }
      for (const child of item.children) {
        const result = findItemByKey([child], nodeKey);
        if (result) {
          return result; // Return the found object from recursion  
        }
      }
    }
    return null;
  }
  function removeNodeByKey(trees: NodeType[], keyToRemove: string): NodeType[] {
    return trees
      .filter(node => node.key !== keyToRemove) // Remove the node if its key matches keyToRemove  
      .map(node => ({
        ...node,
        children: node.children ? removeNodeByKey(node.children, keyToRemove) : [] // Recurse into children  
      }));
  }
  const success = (text: string) => {
    messageApi.open({
      type: 'success',
      content: text,
    });
  };

  const error = (text: string) => {
    messageApi.open({
      type: 'error',
      content: text,
    });
  };
  const handleContextMenuClick = (actionKey: string, nodeKey: string) => {
    switch (actionKey) {
      case 'ACTION1':
        break;
      case 'ACTION2':
        break;
      case 'ACTION3':
        break;
      case 'ACTION4':
        const findItem: NodeType | null = findItemByKey(treeData, nodeKey);
        if (findItem.children.length > 0) {
          error("شخص مورد دارای زیرشاخه میباشد");
        } else {
          const removeResult: NodeType[] = removeNodeByKey(treeData,nodeKey);
          setTreeData([...removeResult]);
          success("شخص مورد نظر با موفقیت حذف شد");
        }
        break;
    }
  }

  const handleUpdateTree = (nodes: NodeType[]) => {

  }

  const handleUpdateNode = (key: string, data: any) => {

  }

  return (
    <AppContext.Provider
      value={{
        treeData,
        updateTreeData: handleUpdateTree
      }}
    >
      <div className="App">
        {contextHolder}
        <Sidebar>
          <ExtendedTree handleContextMenuClick={handleContextMenuClick} />
        </Sidebar>
        {showEdit && <Form item={selectedItem} updateNode={handleUpdateNode} />}
      </div>
    </AppContext.Provider>
  );
}

export default App;
