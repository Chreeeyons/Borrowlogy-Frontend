import Materials from "@/components/MaterialContainer";

const Equipments = () => {
  return (
    <div id="laboratory-materials" className="section">
      <p className="text-white text-center">ADMIN</p>
      <Materials user_type="admin" />
    </div>
  );
};

export default Equipments;
