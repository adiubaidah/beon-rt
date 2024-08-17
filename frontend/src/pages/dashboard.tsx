import Chart from "./component/chart";
function Dashboard() {
  return (
    <div>
      <h1 className="font-bold text-3xl">Selamat datang Admin</h1>
      <div className="mt-10">
        <Chart />
      </div>
    </div>
  );
}

export default Dashboard;
