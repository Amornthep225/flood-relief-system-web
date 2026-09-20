export default function SearchFilter({keyword,setKeyword}){

return (
<div className="search-box">

<input
value={keyword}
onChange={(e)=>setKeyword(e.target.value)}
placeholder="ค้นหาชื่อโครงการ..."
/>

</div>
)

}