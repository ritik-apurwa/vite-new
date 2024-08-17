import ContactFormTable from "../contact/contact-table";

const Admin = () => {
  return (
    <section className="mx-auto flex flex-col max-w-7xl">
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Contact Forms</h1>
        <ContactFormTable />
      </div>
    </section>
  );
};

export default Admin;
