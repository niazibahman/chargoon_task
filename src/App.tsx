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
  const [cutData,setCutData]=useState<NodeType>(null)

  const fetchTreeData = async () => {
    const result = await getNodes();
    setTreeData(result);
  }

  const findItemByKey = (trees: NodeType[], nodeKey: string): NodeType | null => {
    for (const item of trees) {
      if (item.key === nodeKey) {
        return item;
      }
      for (const child of item.children) {
        const result = findItemByKey([child], nodeKey);
        if (result) {
          return result;
        }
      }
    }
    return null;
  }

  function removeNodeByKey(trees: NodeType[], keyToRemove: string): NodeType[] {
    return trees
      .filter(node => node.key !== keyToRemove)
      .map(node => ({
        ...node,
        children: node.children ? removeNodeByKey(node.children, keyToRemove) : []
      }));
  }
  function insertItem(tree:NodeType[], key:string):NodeType[] {  
    const newTree = JSON.parse(JSON.stringify(tree));  

    function insertItem(nodes:NodeType[]) {  
        for (let node of nodes) {  
            if (node.key === key) {  
                node.children.push(cutData);  
                return true;
            }  
            if (node.children && node.children.length > 0) {  
                const found = insertItem(node.children);  
                if (found) {  
                    return true;
                }  
            }  
        }  
        return false;
    }   
    insertItem(newTree);  
    return newTree;
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

  useEffect(() => {
    fetchTreeData()
  }, [])

  const handleContextMenuClick = (actionKey: string, nodeKey: string) => {
    const findItem: NodeType | null = findItemByKey(treeData, nodeKey);
    switch (actionKey) {
      case 'ACTION1':
        break;
      case 'ACTION2':
        if(findItem.children.length === 0){
          setCutData(findItem)
        }
        break;
      case 'ACTION3':
        if(cutData !== null){
          const removeResult: NodeType[] =removeNodeByKey(treeData,cutData.key);
          handleUpdateTree(insertItem(removeResult,nodeKey))
          setCutData(null);
          success("شخص مورد نظر با موفقیت منتقل شد");
        }
        break;
      case 'ACTION4':
        if (findItem.children.length > 0) {
          error("شخص مورد دارای زیرشاخه میباشد");
        } else {
          const removeResult: NodeType[] = removeNodeByKey(treeData, nodeKey);
          handleUpdateTree([...removeResult]);
          success("شخص مورد نظر با موفقیت حذف شد");
        }
        break;
    }
  }

  const handleUpdateTree = (nodes: NodeType[]) => {
    setTreeData(nodes);
  }

  const handleUpdateNode = (key: string, data: any) => {

  }
  useEffect(() => {
    handleUpdateTree(treeData);
  }, [treeData])
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
