const page = () => {
  return (
    <section>
      <nav className="flex justify-between items-center bg-blue-500 p-5 text-white">
        <div>
          <p>Logo</p>
        </div>
        <ul className="flex space-x-1">
          <li className="hover:bg-blue-600 p-2 rounded-md cursor-pointer">
            Home
          </li>
          <li className="hover:bg-blue-600 p-2 rounded-md cursor-pointer">
            Shop
          </li>
          <li className="hover:bg-blue-600 p-2 rounded-md cursor-pointer">
            About
          </li>
          <li className="hover:bg-blue-600 p-2 rounded-md cursor-pointer">
            Contact
          </li>
        </ul>
      </nav>
      <div>
        <h1>Home Page</h1>
      </div>
    </section>
  );
};

export default page;
