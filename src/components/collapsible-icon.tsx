import React from "react";

interface CollapsibleIconProps {
  logotype?: string; // Assuming the logotype is identified by a string key
  className?: string;
}

// Sample SVG elements for each logotype
const logotypeMap: Record<string, React.ReactNode> = {
  addPerson: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_478_1718)">
        <path
          d="M15 12C17.21 12 19 10.21 19 8C19 5.79 17.21 4 15 4C12.79 4 11 5.79 11 8C11 10.21 12.79 12 15 12ZM6 10V8C6 7.45 5.55 7 5 7C4.45 7 4 7.45 4 8V10H2C1.45 10 1 10.45 1 11C1 11.55 1.45 12 2 12H4V14C4 14.55 4.45 15 5 15C5.55 15 6 14.55 6 14V12H8C8.55 12 9 11.55 9 11C9 10.45 8.55 10 8 10H6ZM15 14C12.33 14 7 15.34 7 18V19C7 19.55 7.45 20 8 20H22C22.55 20 23 19.55 23 19V18C23 15.34 17.67 14 15 14Z"
          fill="#FFD749"
        />
      </g>
      <defs>
        <clipPath id="clip0_478_1718">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
  clipboard: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_478_251)">
        <path
          d="M19 3H14.82C14.4 1.84 13.3 1 12 1C10.7 1 9.6 1.84 9.18 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM12 3C12.55 3 13 3.45 13 4C13 4.55 12.55 5 12 5C11.45 5 11 4.55 11 4C11 3.45 11.45 3 12 3ZM13 17H8C7.45 17 7 16.55 7 16C7 15.45 7.45 15 8 15H13C13.55 15 14 15.45 14 16C14 16.55 13.55 17 13 17ZM16 13H8C7.45 13 7 12.55 7 12C7 11.45 7.45 11 8 11H16C16.55 11 17 11.45 17 12C17 12.55 16.55 13 16 13ZM16 9H8C7.45 9 7 8.55 7 8C7 7.45 7.45 7 8 7H16C16.55 7 17 7.45 17 8C17 8.55 16.55 9 16 9Z"
          fill="#FFD749"
        />
      </g>
    </svg>
  ),
  announcement: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 8H4C3.46957 8 2.96086 8.21071 2.58579 8.58579C2.21071 8.96086 2 9.46957 2 10V14C2 14.5304 2.21071 15.0391 2.58579 15.4142C2.96086 15.7893 3.46957 16 4 16H5V20C5 20.2652 5.10536 20.5196 5.29289 20.7071C5.48043 20.8946 5.73478 21 6 21H8C8.26522 21 8.51957 20.8946 8.70711 20.7071C8.89464 20.5196 9 20.2652 9 20V16H12L17 20V4L12 8ZM21.5 12C21.5 13.71 20.54 15.26 19 16V8C20.53 8.75 21.5 10.3 21.5 12Z"
        fill="#FFD749"
      />
    </svg>
  ),
  public: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_478_916)">
        <path
          d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V18C1 18.55 1.45 19 2 19H14C14.55 19 15 18.55 15 18V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C15.05 13.06 15.06 13.08 15.07 13.09C16.21 13.92 17 15.03 17 16.5V18C17 18.35 16.93 18.69 16.82 19H22C22.55 19 23 18.55 23 18V16.5C23 14.17 18.33 13 16 13Z"
          fill="#FFD749"
        />
      </g>
      <defs>
        <clipPath id="clip0_478_916">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
  vote: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_478_1854)">
        <path
          d="M11.34 15.02C11.73 15.41 12.36 15.41 12.75 15.02L19.11 8.66004C19.5 8.27004 19.5 7.64004 19.11 7.25004L14.16 2.30004C13.78 1.90004 13.15 1.90004 12.76 2.29004L6.39 8.66004C6 9.05004 6 9.68004 6.39 10.07L11.34 15.02ZM13.46 4.41004L17 7.95004L12.05 12.9L8.51 9.36004L13.46 4.41004ZM20.41 15.41L18.29 13.29C18.11 13.11 17.85 13 17.59 13H17.32L15.32 15H17.23L19 17H5L6.78 15H8.83L6.83 13H6.41C6.14 13 5.89 13.11 5.7 13.29L3.58 15.41C3.21 15.79 3 16.3 3 16.83V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.11 21 20V16.83C21 16.3 20.79 15.79 20.41 15.41Z"
          fill="#FFD749"
        />
      </g>
      <defs>
        <clipPath id="clip0_478_1854">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
  addVote: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_478_1026)">
        <path
          d="M9 8.00002C8.45 8.00002 8 8.45002 8 9.00002V12H5C4.45 12 4 12.45 4 13C4 13.55 4.45 14 5 14H8V17C8 17.55 8.45 18 9 18C9.55 18 10 17.55 10 17V14H13C13.55 14 14 13.55 14 13C14 12.45 13.55 12 13 12H10V9.00002C10 8.45002 9.55 8.00002 9 8.00002ZM14.5 6.79002C14.5 7.36002 15.02 7.79002 15.58 7.68002L17 7.40002V17C17 17.55 17.45 18 18 18C18.55 18 19 17.55 19 17V6.27002C19 5.62002 18.4 5.15002 17.77 5.30002L15.2 5.92002C14.79 6.01002 14.5 6.38002 14.5 6.79002Z"
          fill="#FFD749"
        />
      </g>
      <defs>
        <clipPath id="clip0_478_1026">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
  violation: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_478_1097)">
        <path
          d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM4 12C4 7.58 7.58 4 12 4C13.85 4 15.55 4.63 16.9 5.69L5.69 16.9C4.63 15.55 4 13.85 4 12ZM12 20C10.15 20 8.45 19.37 7.1 18.31L18.31 7.1C19.37 8.45 20 10.15 20 12C20 16.42 16.42 20 12 20Z"
          fill="#FFD749"
        />
      </g>
      <defs>
        <clipPath id="clip0_478_1097">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
};

const CollapsibleIcon: React.FC<CollapsibleIconProps> = ({
  logotype,
  className,
}) => {
  return (
    <>
      {logotype && logotypeMap[logotype] ? (
        <div className={className}>{logotypeMap[logotype]}</div>
      ) : null}
    </>
  );
};

export default CollapsibleIcon;
