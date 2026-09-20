export default function WaterChart({projects=[]}){

const count=Math.min(projects.length,100);

return (
<div className="chart-box">
<h3>📈 Project Volume</h3>
<div className="bar">
<div style={{width:`${count}%`}}></div>
</div>
<p>{projects.length} โครงการ</p>
</div>
)
}