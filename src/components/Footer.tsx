const Footer = () => {
  return (
    <footer className="flex justify-center items-center py-5">
      <a
        href="https://s.id/JadwalSeminarSkripsi"
        target="_blank"
        rel="noreferrer"
        className="mr-5 text-green-500 hover:underline font-bold cursor-pointer hover:text-green-300"
      >
        Source Data
      </a>
      <a
        href="https://github.com/oktoala/seminar"
        target="_blank"
        rel="noreferrer"
        className="text-fuchsia-500 hover:underline font-bold cursor-pointer hover:text-fuchsia-300"
      >
        Source Code
      </a>
    </footer>
  );
};

export default Footer;
