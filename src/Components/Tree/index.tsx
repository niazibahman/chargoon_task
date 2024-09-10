import { Input, Tree } from 'antd';
import React, { useContext, useRef, useState } from 'react';
import AppContext from '../../appContext';
import { NodeType } from '../../types';
import Node from './node';
import SearchResult from './searchResult';

const { Search } = Input;

interface Props {
  handleContextMenuClick: (key: string,nodeKey:string) => void;
}

const TreeExtended: React.FC<Props> = ({ handleContextMenuClick }) => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const searchedKeyword = useRef();
  const [searchResultVisible, setSearchResultVisible] = useState(true);
  const [searchedTitle,setSearchedTitle]= useState<string>('')
  const { treeData } = useContext(AppContext);
  
  const onExpand = (newExpandedKeys: any[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };
  function searchByTitle(data:NodeType[], searchTerm:string) {  
    console.log(data,"bahman")
    const results:NodeType[] = [];  

    function searchRecursive(nodes:NodeType[]) {  
        for (const node of nodes) {  
            // Check if the current node's title includes the search term  
            if (node.title.includes(searchTerm)) {  
                results.push(node); // Add to results if it matches  
            }  
            // If the node has children, search in them recursively  
            if (node.children && node.children.length) {  
                searchRecursive(node.children);  
            }  
        }  
    }  
    
    searchRecursive(data);  
    return results;  
} 
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("ssssss")
    setSearchedTitle(e.target.value);
  };

  const handlePressEnter = () => {
    console.log("enterrrrr")
    setSearchResultVisible(true)
  }

  const titleRenderer = (node: NodeType) => {
    return <Node node={node} handleContextMenuClick={handleContextMenuClick} />
  }

  return (
    <div onClick={(event)=>event.stopPropagation()} className='tree-wrap'>
      <Search style={{ marginBottom: 8 }} placeholder="جستجو" onChange={handleSearchInputChange} onPressEnter={handlePressEnter} />
      <Tree
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        treeData={treeData}
        titleRender={titleRenderer}
      />
      {searchResultVisible && <SearchResult items={searchedTitle===''?[]: searchByTitle(treeData,searchedTitle)} />}
    </div>
  );
};

export default TreeExtended;