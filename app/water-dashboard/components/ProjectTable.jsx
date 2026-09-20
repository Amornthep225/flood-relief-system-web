export default function ProjectTable({projects,onSelect}){

return (
<table>

<thead>
<tr>
<th>ลำดับ</th>
<th>รหัสโครงการ</th>
<th>ชื่อโครงการ</th>
</tr>
</thead>

<tbody>

{
projects.map((item,index)=>(

<tr
key={index}
onClick={()=>onSelect(item)}
style={{cursor:"pointer"}}
>

<td>{item.RowNo}</td>
<td>{item.ProjectID}</td>
<td>{item.ProjectNameTH}</td>

</tr>

))
}

</tbody>

</table>
)

}