export default function WaterAnalytics({projects=[]}){

const topProjects = projects.slice(0,10);

return (
<div className="analytics">

<div className="analytics-card">
<h3>📊 ภาพรวมโครงการ</h3>

<div className="big-number">
{projects.length}
</div>

<p>จำนวนโครงการทั้งหมด</p>

</div>


<div className="analytics-card">

<h3>🔥 โครงการล่าสุด</h3>

{
topProjects.map((item,index)=>(
<div className="project-item" key={index}>
<span>#{index+1}</span>
<span>{item.ProjectNameTH || "-"}</span>
</div>
))
}

</div>

</div>
)

}