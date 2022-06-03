import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'

const Form = () => {
    const [person, setperson] = useState({})
    const [list, setlist] = useState([])
    const [page, setpage] = useState(1)
    const [totalpage, settotalpage] = useState(0)

    let {name,age,address,salary,dept,check}=person;
    const gotData=async(e)=>{
        e.preventDefault();
        await axios.post("http://localhost:8080/data",person)
       let r= await axios.get(`http://localhost:8080/data?_page=${page}&_limit=5`)
        setlist(r.data)
        // console.log(list);       
    }
    const handle=(e)=>{
       const {type,value,name,checked} =e.target;
       if(name==="check")
        setperson({...person,[name]:checked})
        else
        setperson({...person,[name]:value})
    }
    const deleted=async(val)=>{
        await axios.delete(`http://localhost:8080/data/${val}`)
        let r= await axios.get(`http://localhost:8080/data?_page=${page}&_limit=5`)
        setlist(r.data)
    }

    const bydept=async(e)=>{
        let val1=e.target.value;
        let r= await axios.get(`http://localhost:8080/data?_limit=5`)
        let list1=r.data;
        let newList=list1.filter(item=>item.dept===val1);
        setlist([...newList])
    }


    useEffect(() => {const gt=async()=>{
        let r= await axios.get(`http://localhost:8080/data?_page=${page}&_limit=5`)
        setlist(r.data)
        settotalpage(Number(r.headers["x-total-count"]))
    }
    gt();
    }, [page])
    
    const bysal=(e)=>{
        let val1=e.target.value;
        if(val1==2)
        list.sort((a,b)=>a.salary-b.salary)
        else
        list.sort((a,b)=>b.salary-a.salary)
        setlist([...list])
    }
    

  return (
    <div>
        <form onSubmit={gotData} >
            <label>
                <input type="text" name='name' placeholder='Enter name' onChange={handle}/>
            </label>
            <label>
                <input type="number" name='age' placeholder='Enter age' onChange={handle}/>
            </label>
            <label>
                <input type="text" name='address' placeholder='Enter address' onChange={handle}/>
            </label>
            <label>
                <input type="number" name='salary' placeholder='Enter salary' onChange={handle}/>
            </label>
            <label>
                <select name="dept" onChange={handle}>
                    <option >Filter a dept</option>
                    <option value="mech">Mech</option>
                    <option value="cs">CS</option>
                </select>
            </label>
            <label>
                Marital Status
                <input type="checkbox" name='check' onChange={handle}/>
            </label>
            <input type="submit" />
        </form>

        <select onChange={bydept}>
            <option >Sort by dept</option>
            <option value="mech">mech</option>
            <option value="cs">cs</option>
        </select>
        <select onChange={bysal}>
            <option >Sort by Salary</option>
            <option value="1">High to Low</option>
            <option value="2">Low to High</option>
        </select>
        <button disabled={page<=1} onClick={()=>setpage(page-1)}>{'<'}</button>
        <button disabled={totalpage<page*5} onClick={()=>setpage(page+1)}>{'>'}</button>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Address</th>
                    <th>Salary</th>
                    <th>Department</th>
                    <th>Married?</th>
                </tr>
            </thead>
            <tbody>
                {list.map(e=>(
                    <tr>
                        <td>{e.name}</td>
                        <td>{e.age}</td>
                        <td>{e.address}</td>
                        <td>{e.salary}</td>
                        <td>{e.dept}</td>
                        <td>{e.check?"Yes":"No"}</td>
                        <td><button onClick={()=>deleted(e.id)}>X</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
        
    </div>
  )
}

export default Form