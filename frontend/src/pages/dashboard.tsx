import Chart from "./component/chart";
import SisaDana from "./component/sisa-dana";
function Dashboard() {
  return (
    <div>
      <h1 className="font-bold text-3xl">Selamat datang Admin</h1>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-5 w-full max-w-3xl">
        <SisaDana />
      </div>
      <div className="mt-10">
        <Chart />
      </div>
    </div>
  );
}

export default Dashboard;
