export const InstallMobileIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="32"
      viewBox="0 -960 960 960"
      width="32"
    >
      <linearGradient id="grad1" x1="0%" y1="100%" x2="100%" y2="0%">
        {/* <stop offset="0%" style={{ stopColor: "#6366f1" }} /> */}
        {/* <stop offset="50%" style={{ stopColor: "#db2777" }} /> */}
        {/* <stop offset="100%" style={{ stopColor: "#eab308" }} /> */}
      </linearGradient>
      <path
        style={{ fill: `url(#grad1)` }}
        d="M260-40q-24 0-42-18t-18-42v-760q0-24 18-42t42-18h320v60H260v30h320v60H260v580h440v-130h60v220q0 24-18 42t-42 18H260Zm0-90v30h440v-30H260Zm474-284L548-600l42-42 114 113v-301h60v301l114-113 42 42-186 186ZM260-830v-30 30Zm0 700v30-30Z"
      />
    </svg>
  );
};
export const InstallDesktopIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="32"
      viewBox="0 -960 960 960"
      width="32"
      className="fill-white"
    >
      <linearGradient id="grad2" x1="0%" y1="100%" x2="100%" y2="0%">
        {/* <stop offset="0%" style={{ stopColor: "#6366f1" }} /> */}
        {/* <stop offset="50%" style={{ stopColor: "#db2777" }} /> */}
        {/* <stop offset="100%" style={{ stopColor: "#eab308" }} /> */}
      </linearGradient>
      <path
        // style={{ fill: `url(#grad2)` }}
        d="M330-120v-80H140q-24 0-42-18t-18-42v-520q0-24 18-42t42-18h360v60H140v520h680v-140h60v140q0 24-18 42t-42 18H630v80H330Zm350-294L494-600l42-42 114 114v-312h60v312l114-114 42 42-186 186Z"
      />
    </svg>
  );
};
