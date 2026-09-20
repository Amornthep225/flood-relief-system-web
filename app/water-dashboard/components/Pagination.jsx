export default function Pagination({page,setPage,total}){

return (
<div className="pagination">

<button
disabled={page===1}
onClick={()=>setPage(page-1)}
>
ก่อนหน้า
</button>

<span>
{page} / {total}
</span>

<button
disabled={page===total}
onClick={()=>setPage(page+1)}
>
ถัดไป
</button>

</div>
)

}