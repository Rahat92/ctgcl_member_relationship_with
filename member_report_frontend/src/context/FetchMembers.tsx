import { Dispatch, FC, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react";

interface ComponentProp {
    children: ReactNode;
    }
    
    interface Member {
        id: number;
        name: string;
        // Add more fields as per your structure
      }

    interface FetchMembersInfoContextType {
        memberInfos: {};
        parameter: {
            Mobile: string;
            RowPerPage:number;
            PageNumber: number;
        };
        setParameter: {};
      }

interface Parameter {
    Mobile: string;
    RowPerPage: number;
    PageNumber: number;
    PrvCusID: string;
    CusName: string;
}
const FetchMembersInfoContext = createContext<FetchMembersInfoContextType | undefined>(undefined);
export const MemberInfoProvider: FC<ComponentProp> = ({children}) => {
    const [memberInfos, setMembersInfo] = useState({});
    const [parameter, setParameter] = useState<Parameter| any>(
        {
            Mobile:'',
            RowPerPage:10,
            PageNumber: 1,
            CusName: '',
            PrvCusID: ''
        }
    )
    // const [isLoading, setIsLoading] = useState<boolean>()
    useEffect(() => {
        // setIsLoading(true)
        const url=`http://192.168.70.79:3001/api/v1/members?${parameter.Mobile?'&Mobile='+parameter.Mobile:''}${parameter.CusName?'&CusName='+parameter.CusName:''}${parameter.RowPerPage?'&RowPerPage='+parameter.RowPerPage:''}&PageNumber=${parameter.PageNumber||1}${parameter.PrvCusID?'&PrvCusID='+parameter.PrvCusID:''}`
		fetch(url).then(res => res.json()).then(data => {
            console.log(data)
            setMembersInfo({data:data.data})

        }).catch(err => {
            // setIsLoading(false)
            console.log(err)
        })
	}, [parameter])
    return (
        // <FetchMembersInfoContext.Provider value = {{memberInfos, setMembersInfo, setParameter, parameter, isLoading}}>
        <FetchMembersInfoContext.Provider value = {{memberInfos, parameter, setParameter}}>
            {children}
        </FetchMembersInfoContext.Provider>
    )
}

export const useMembersInfo = () => useContext(FetchMembersInfoContext)