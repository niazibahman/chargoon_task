import React, { useContext, useState } from 'react';
import { NodeType } from '../../types';
import OrgchartIcon from '../SvgIcons/orgchart';
import ArrowDownIcon from '../SvgIcons/arrow-down';
import ArrowUpIcon from '../SvgIcons/arrow-up';
import { Popover, Tree } from 'antd';
import AppContext from '../../appContext';
interface Props {
	items: (NodeType & { hierarchy: string[] })[]
}

function SearchResult({ items }: Props) {
	const [isOpen,setIsOpen]=useState<boolean>(true);
	const { treeData } = useContext(AppContext);
	const [ansectorKey,setAnsectorKey]=useState<NodeType[]>([])
	const content = (
		<div>
			<Tree treeData={ansectorKey} autoExpandParent={true} defaultExpandAll={true}/>
		</div>
	  );
	  function findAncestorsByKey(tree: NodeType[], key: string, ancestors: NodeType[] = []): NodeType[] | undefined {  
		for (const node of tree) {  
			if (node.key === key) {  
				return [node]; 
			}  
			if (node.children && node.children.length > 0) {  
				const childResult = findAncestorsByKey(node.children, key);  
				if (childResult) {  
					const t:NodeType[] = [{  
						title: node.title,
						users: node.users,
						key: node.key,
						children: childResult,
						parentKey: node.parentKey,
						data: node.data,
						hierarchy: node.hierarchy,
						accesses: node.accesses
					}];
					return t;
				}  
			}  
		}  
		return null;
	}  
	  const handleShowAncestors = (key:string)=>{
		console.log(findAncestorsByKey(treeData,key))
		setAnsectorKey(findAncestorsByKey(treeData,key));
	  }
	return <div className='search-result' style={{height: isOpen? 200:30, overflow: 'auto' }}>
		<div style={{width:"100%" ,display:"inline-flex", justifyContent:"center"}}>
			<button onClick={()=>setIsOpen(!isOpen)} style={{cursor:"pointer"}}>
			{
				isOpen ? <ArrowDownIcon/>:<ArrowUpIcon/>
			}
			</button>
		</div>
		{items.map(item => (
			<div style={{width:"100%" ,display:"inline-flex", justifyContent:"space-between"}}>
				<span>{item.title}</span>
				<Popover placement="leftTop" content={content} trigger="click">
				<button onClick={()=>handleShowAncestors(item.key)}>
				<OrgchartIcon/>
				</button>
				</Popover>
			</div>
		))
		}
	</div>
}
export default SearchResult;