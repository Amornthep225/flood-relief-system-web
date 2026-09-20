export default function StatCard({ title, value }) {

    return (
        <div className="card">

            <div className="muted">
                {title}
            </div>

            <div className="number">
                {value}
            </div>

        </div>
    )
}