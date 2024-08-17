import { FC, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useModalContext } from "../context/modalContext";
import api from "../axios/axios";
import { Link } from "react-router-dom";
interface memberDetailsInfo{
    memberDetailInfo:{
      CusName:string;
    }
}

interface relatives{
  Father: [],
  Mother:[],
  Child: [],
  Spouse:[],
  Grandfather:[]
}
const MemberDetailModal: FC<memberDetailsInfo> = ({memberDetailInfo}) => {

  const [relatives, setRelatives] = useState<relatives>({
    Father:[],
    Mother:[],
    Child:[],
    Spouse:[],
    Grandfather:[]
  })

  const { setIsOpenModal } = useModalContext() || {};

  const closeModal = () => {
    setIsOpenModal(false);
  };
  const portalDiv = document.getElementById("modal");

  if (!portalDiv) {
    return null;
  }

  const fetchMemberRelatives = async() => {
    const result = await api.get(`/members/${memberDetailInfo.PrvCusID}`) 
    return result;
  }

  useEffect(() => {
    fetchMemberRelatives().then(result => {
      setRelatives(result.data.data.data)
    })
  }, [])
  console.log(relatives)
  return createPortal(
    <div className="z-100 flex justify-center items-center font-bold h-screen fixed top-0 bottom-0 left-0 right-0 bg-gray-500 bg-opacity-30">
      <div
        id="timeline-modal"
        className="overflow-y-auto overflow-x-hidden relative top-0 left-[50%] z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative left-[40%] top-[10%] p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-black">
                {memberDetailInfo.CusName}'s Relatives
              </h3>
              <button
                onClick={closeModal}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="timeline-modal"
              >
                <svg
                  className="w-3 h-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-4 md:p-5">
              <ol className="relative border-s border-gray-200 dark:border-gray-600 ms-3.5 mb-4 md:mb-5">
                <li className="mb-10 ms-8">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full -start-3.5 ring-8 ring-gray dark:ring-gray-700 dark:bg-white">
                    <svg
                      className="w-2.5 h-2.5 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill="currentColor"
                        d="M6 1a1 1 0 0 0-2 0h2ZM4 4a1 1 0 0 0 2 0H4Zm7-3a1 1 0 1 0-2 0h2ZM9 4a1 1 0 1 0 2 0H9Zm7-3a1 1 0 1 0-2 0h2Zm-2 3a1 1 0 1 0 2 0h-2ZM1 6a1 1 0 0 0 0 2V6Zm18 2a1 1 0 1 0 0-2v2ZM5 11v-1H4v1h1Zm0 .01H4v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM10 11v-1H9v1h1Zm0 .01H9v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM10 15v-1H9v1h1Zm0 .01H9v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM15 15v-1h-1v1h1Zm0 .01h-1v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM15 11v-1h-1v1h1Zm0 .01h-1v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM5 15v-1H4v1h1Zm0 .01H4v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM2 4h16V2H2v2Zm16 0h2a2 2 0 0 0-2-2v2Zm0 0v14h2V4h-2Zm0 14v2a2 2 0 0 0 2-2h-2Zm0 0H2v2h16v-2ZM2 18H0a2 2 0 0 0 2 2v-2Zm0 0V4H0v14h2ZM2 4V2a2 2 0 0 0-2 2h2Zm2-3v3h2V1H4Zm5 0v3h2V1H9Zm5 0v3h2V1h-2ZM1 8h18V6H1v2Zm3 3v.01h2V11H4Zm1 1.01h.01v-2H5v2Zm1.01-1V11h-2v.01h2Zm-1-1.01H5v2h.01v-2ZM9 11v.01h2V11H9Zm1 1.01h.01v-2H10v2Zm1.01-1V11h-2v.01h2Zm-1-1.01H10v2h.01v-2ZM9 15v.01h2V15H9Zm1 1.01h.01v-2H10v2Zm1.01-1V15h-2v.01h2Zm-1-1.01H10v2h.01v-2ZM14 15v.01h2V15h-2Zm1 1.01h.01v-2H15v2Zm1.01-1V15h-2v.01h2Zm-1-1.01H15v2h.01v-2ZM14 11v.01h2V11h-2Zm1 1.01h.01v-2H15v2Zm1.01-1V11h-2v.01h2Zm-1-1.01H15v2h.01v-2ZM4 15v.01h2V15H4Zm1 1.01h.01v-2H5v2Zm1.01-1V15h-2v.01h2Zm-1-1.01H5v2h.01v-2Z"
                      />
                    </svg>
                  </span>
                  <h3 className="flex items-start mb-1 text-lg font-semibold text-gray-900 dark:text-black">
                    Father
                  </h3>
                  <p className="block mb-3 text-sm font-normal leading-none text-gray-500 dark:text-gray-400">
                    {/* {relatives.Father&&relatives.Father[0]&&relatives.Father[0].CusName?relatives.Father[0]?.CusName:relatives.Father&&relatives.Father[0]} */}
                    {relatives.Father}
                  </p>
                  {/* <button
                    type="button"
                    className="py-2 px-3 inline-flex items-center text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    <svg
                      className="w-3 h-3 me-1.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                      <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                    </svg>
                    Father Details
                  </button> */}
                </li>
                <li className="mb-10 ms-8">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full -start-3.5 ring-8 ring-gray dark:ring-gray-700 dark:bg-white">
                    <svg
                      className="w-2.5 h-2.5 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill="currentColor"
                        d="M6 1a1 1 0 0 0-2 0h2ZM4 4a1 1 0 0 0 2 0H4Zm7-3a1 1 0 1 0-2 0h2ZM9 4a1 1 0 1 0 2 0H9Zm7-3a1 1 0 1 0-2 0h2Zm-2 3a1 1 0 1 0 2 0h-2ZM1 6a1 1 0 0 0 0 2V6Zm18 2a1 1 0 1 0 0-2v2ZM5 11v-1H4v1h1Zm0 .01H4v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM10 11v-1H9v1h1Zm0 .01H9v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM10 15v-1H9v1h1Zm0 .01H9v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM15 15v-1h-1v1h1Zm0 .01h-1v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM15 11v-1h-1v1h1Zm0 .01h-1v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM5 15v-1H4v1h1Zm0 .01H4v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM2 4h16V2H2v2Zm16 0h2a2 2 0 0 0-2-2v2Zm0 0v14h2V4h-2Zm0 14v2a2 2 0 0 0 2-2h-2Zm0 0H2v2h16v-2ZM2 18H0a2 2 0 0 0 2 2v-2Zm0 0V4H0v14h2ZM2 4V2a2 2 0 0 0-2 2h2Zm2-3v3h2V1H4Zm5 0v3h2V1H9Zm5 0v3h2V1h-2ZM1 8h18V6H1v2Zm3 3v.01h2V11H4Zm1 1.01h.01v-2H5v2Zm1.01-1V11h-2v.01h2Zm-1-1.01H5v2h.01v-2ZM9 11v.01h2V11H9Zm1 1.01h.01v-2H10v2Zm1.01-1V11h-2v.01h2Zm-1-1.01H10v2h.01v-2ZM9 15v.01h2V15H9Zm1 1.01h.01v-2H10v2Zm1.01-1V15h-2v.01h2Zm-1-1.01H10v2h.01v-2ZM14 15v.01h2V15h-2Zm1 1.01h.01v-2H15v2Zm1.01-1V15h-2v.01h2Zm-1-1.01H15v2h.01v-2ZM14 11v.01h2V11h-2Zm1 1.01h.01v-2H15v2Zm1.01-1V11h-2v.01h2Zm-1-1.01H15v2h.01v-2ZM4 15v.01h2V15H4Zm1 1.01h.01v-2H5v2Zm1.01-1V15h-2v.01h2Zm-1-1.01H5v2h.01v-2Z"
                      />
                    </svg>
                  </span>
                  <h3 className="flex items-start mb-1 text-lg font-semibold text-gray-900 dark:text-black">
                    Mother
                  </h3>
                  <p className="block mb-3 text-sm font-normal leading-none text-gray-500 dark:text-gray-400">
                  {/* {relatives.Mother&&relatives.Mother[0]&&relatives.Mother[0].CusName?relatives.Mother[0]?.CusName:relatives.Mother&&relatives.Mother[0]} */}
                    {relatives.mother}
                  </p>
                  {/* <button
                    type="button"
                    className="py-2 px-3 inline-flex items-center text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    <svg
                      className="w-3 h-3 me-1.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                      <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                    </svg>
                    Mother Details
                  </button> */}
                </li>
                <li className="mb-10 ms-8">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full -start-3.5 ring-8 ring-gray dark:ring-gray-700 dark:bg-white">
                    <svg
                      className="w-2.5 h-2.5 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill="currentColor"
                        d="M6 1a1 1 0 0 0-2 0h2ZM4 4a1 1 0 0 0 2 0H4Zm7-3a1 1 0 1 0-2 0h2ZM9 4a1 1 0 1 0 2 0H9Zm7-3a1 1 0 1 0-2 0h2Zm-2 3a1 1 0 1 0 2 0h-2ZM1 6a1 1 0 0 0 0 2V6Zm18 2a1 1 0 1 0 0-2v2ZM5 11v-1H4v1h1Zm0 .01H4v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM10 11v-1H9v1h1Zm0 .01H9v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM10 15v-1H9v1h1Zm0 .01H9v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM15 15v-1h-1v1h1Zm0 .01h-1v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM15 11v-1h-1v1h1Zm0 .01h-1v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM5 15v-1H4v1h1Zm0 .01H4v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM2 4h16V2H2v2Zm16 0h2a2 2 0 0 0-2-2v2Zm0 0v14h2V4h-2Zm0 14v2a2 2 0 0 0 2-2h-2Zm0 0H2v2h16v-2ZM2 18H0a2 2 0 0 0 2 2v-2Zm0 0V4H0v14h2ZM2 4V2a2 2 0 0 0-2 2h2Zm2-3v3h2V1H4Zm5 0v3h2V1H9Zm5 0v3h2V1h-2ZM1 8h18V6H1v2Zm3 3v.01h2V11H4Zm1 1.01h.01v-2H5v2Zm1.01-1V11h-2v.01h2Zm-1-1.01H5v2h.01v-2ZM9 11v.01h2V11H9Zm1 1.01h.01v-2H10v2Zm1.01-1V11h-2v.01h2Zm-1-1.01H10v2h.01v-2ZM9 15v.01h2V15H9Zm1 1.01h.01v-2H10v2Zm1.01-1V15h-2v.01h2Zm-1-1.01H10v2h.01v-2ZM14 15v.01h2V15h-2Zm1 1.01h.01v-2H15v2Zm1.01-1V15h-2v.01h2Zm-1-1.01H15v2h.01v-2ZM14 11v.01h2V11h-2Zm1 1.01h.01v-2H15v2Zm1.01-1V11h-2v.01h2Zm-1-1.01H15v2h.01v-2ZM4 15v.01h2V15H4Zm1 1.01h.01v-2H5v2Zm1.01-1V15h-2v.01h2Zm-1-1.01H5v2h.01v-2Z"
                      />
                    </svg>
                  </span>
                  <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-black">
                    Children
                  </h3>
                  <p className="block mb-3 text-sm font-normal leading-none text-gray-500 dark:text-gray-400">
                    <ul>
                    {relatives&&relatives.Children&&relatives.Children.length>0&&relatives.Children.map((el, i) => {
                      return(
                        <>
                          <li className="py-1">
                            {el}
                          </li>
                        </>
                      )
                    })}
                    </ul>
                  </p>
                  {/* <button
                    type="button"
                    className="py-2 px-3 inline-flex items-center text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    <svg
                      className="w-3 h-3 me-1.5"
                      aria-hidden="true"
                      viewBox="0 0 30 45"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.50012 45C11.6401 45 15.0002 41.6399 15.0002 37.4999V29.9999H7.50012C3.36009 29.9999 0 33.3599 0 37.4999C0 41.6399 3.36009 45 7.50012 45Z"
                        fill="#0ACF83"
                      />
                      <path
                        d="M0 22.5C0 18.36 3.36009 14.9999 7.50012 14.9999H15.0002V29.9999H7.50012C3.36009 30.0001 0 26.64 0 22.5Z"
                        fill="#A259FF"
                      />
                      <path
                        d="M0 7.50006C0 3.36006 3.36009 0 7.50012 0H15.0002V14.9999H7.50012C3.36009 14.9999 0 11.6401 0 7.50006Z"
                        fill="#F24E1E"
                      />
                      <path
                        d="M15.0002 0H22.4999C26.6399 0 30 3.36006 30 7.50006C30 11.6401 26.6399 14.9999 22.4999 14.9999L15.0002 14.9999V0Z"
                        fill="#FF7262"
                      />
                      <path
                        d="M30 22.5C30 26.64 26.6399 30 22.4999 30C18.3599 30 14.9998 26.64 14.9998 22.5C14.9998 18.36 18.3599 14.9999 22.4999 14.9999C26.6399 14.9999 30 18.36 30 22.5Z"
                        fill="#1ABCFE"
                      />
                    </svg>
                    Children details
                  </button> */}
                </li>
                <li className="mb-10 ms-8">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full -start-3.5 ring-8 ring-gray dark:ring-gray-700 dark:bg-white">
                    <svg
                      className="w-2.5 h-2.5 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill="currentColor"
                        d="M6 1a1 1 0 0 0-2 0h2ZM4 4a1 1 0 0 0 2 0H4Zm7-3a1 1 0 1 0-2 0h2ZM9 4a1 1 0 1 0 2 0H9Zm7-3a1 1 0 1 0-2 0h2Zm-2 3a1 1 0 1 0 2 0h-2ZM1 6a1 1 0 0 0 0 2V6Zm18 2a1 1 0 1 0 0-2v2ZM5 11v-1H4v1h1Zm0 .01H4v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM10 11v-1H9v1h1Zm0 .01H9v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM10 15v-1H9v1h1Zm0 .01H9v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM15 15v-1h-1v1h1Zm0 .01h-1v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM15 11v-1h-1v1h1Zm0 .01h-1v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM5 15v-1H4v1h1Zm0 .01H4v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM2 4h16V2H2v2Zm16 0h2a2 2 0 0 0-2-2v2Zm0 0v14h2V4h-2Zm0 14v2a2 2 0 0 0 2-2h-2Zm0 0H2v2h16v-2ZM2 18H0a2 2 0 0 0 2 2v-2Zm0 0V4H0v14h2ZM2 4V2a2 2 0 0 0-2 2h2Zm2-3v3h2V1H4Zm5 0v3h2V1H9Zm5 0v3h2V1h-2ZM1 8h18V6H1v2Zm3 3v.01h2V11H4Zm1 1.01h.01v-2H5v2Zm1.01-1V11h-2v.01h2Zm-1-1.01H5v2h.01v-2ZM9 11v.01h2V11H9Zm1 1.01h.01v-2H10v2Zm1.01-1V11h-2v.01h2Zm-1-1.01H10v2h.01v-2ZM9 15v.01h2V15H9Zm1 1.01h.01v-2H10v2Zm1.01-1V15h-2v.01h2Zm-1-1.01H10v2h.01v-2ZM14 15v.01h2V15h-2Zm1 1.01h.01v-2H15v2Zm1.01-1V15h-2v.01h2Zm-1-1.01H15v2h.01v-2ZM14 11v.01h2V11h-2Zm1 1.01h.01v-2H15v2Zm1.01-1V11h-2v.01h2Zm-1-1.01H15v2h.01v-2ZM4 15v.01h2V15H4Zm1 1.01h.01v-2H5v2Zm1.01-1V15h-2v.01h2Zm-1-1.01H5v2h.01v-2Z"
                      />
                    </svg>
                  </span>
                  <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-black">
                    Spouse
                  </h3>
                  <p className="block mb-3 text-sm font-normal leading-none text-gray-500 dark:text-gray-400">
                    <ul>
                    {/* {relatives&&relatives.Spouse&&relatives.Spouse.length>0&&relatives.Spouse.map((el, i) => {
                      return(
                        <>
                          <li className="py-1">
                            Spouse {i+1+': '}
                            {typeof(el)==='object'?<Link to={`/${el.CusName}`}>{el.CusName}</Link>:el}
                          </li>
                        </>
                      )
                    })} */}
                    <li>{relatives.Spouse}</li>
                    </ul>
                  </p>
                  {/* <button
                    type="button"
                    className="py-2 px-3 inline-flex items-center text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    <svg
                      className="w-3 h-3 me-1.5"
                      aria-hidden="true"
                      viewBox="0 0 30 45"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.50012 45C11.6401 45 15.0002 41.6399 15.0002 37.4999V29.9999H7.50012C3.36009 29.9999 0 33.3599 0 37.4999C0 41.6399 3.36009 45 7.50012 45Z"
                        fill="#0ACF83"
                      />
                      <path
                        d="M0 22.5C0 18.36 3.36009 14.9999 7.50012 14.9999H15.0002V29.9999H7.50012C3.36009 30.0001 0 26.64 0 22.5Z"
                        fill="#A259FF"
                      />
                      <path
                        d="M0 7.50006C0 3.36006 3.36009 0 7.50012 0H15.0002V14.9999H7.50012C3.36009 14.9999 0 11.6401 0 7.50006Z"
                        fill="#F24E1E"
                      />
                      <path
                        d="M15.0002 0H22.4999C26.6399 0 30 3.36006 30 7.50006C30 11.6401 26.6399 14.9999 22.4999 14.9999L15.0002 14.9999V0Z"
                        fill="#FF7262"
                      />
                      <path
                        d="M30 22.5C30 26.64 26.6399 30 22.4999 30C18.3599 30 14.9998 26.64 14.9998 22.5C14.9998 18.36 18.3599 14.9999 22.4999 14.9999C26.6399 14.9999 30 18.36 30 22.5Z"
                        fill="#1ABCFE"
                      />
                    </svg>
                    Children details
                  </button> */}
                </li>
                <li className="mb-10 ms-8">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full -start-3.5 ring-8 ring-gray dark:ring-gray-700 dark:bg-white">
                    <svg
                      className="w-2.5 h-2.5 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill="currentColor"
                        d="M6 1a1 1 0 0 0-2 0h2ZM4 4a1 1 0 0 0 2 0H4Zm7-3a1 1 0 1 0-2 0h2ZM9 4a1 1 0 1 0 2 0H9Zm7-3a1 1 0 1 0-2 0h2Zm-2 3a1 1 0 1 0 2 0h-2ZM1 6a1 1 0 0 0 0 2V6Zm18 2a1 1 0 1 0 0-2v2ZM5 11v-1H4v1h1Zm0 .01H4v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM10 11v-1H9v1h1Zm0 .01H9v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM10 15v-1H9v1h1Zm0 .01H9v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM15 15v-1h-1v1h1Zm0 .01h-1v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM15 11v-1h-1v1h1Zm0 .01h-1v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM5 15v-1H4v1h1Zm0 .01H4v1h1v-1Zm.01 0v1h1v-1h-1Zm0-.01h1v-1h-1v1ZM2 4h16V2H2v2Zm16 0h2a2 2 0 0 0-2-2v2Zm0 0v14h2V4h-2Zm0 14v2a2 2 0 0 0 2-2h-2Zm0 0H2v2h16v-2ZM2 18H0a2 2 0 0 0 2 2v-2Zm0 0V4H0v14h2ZM2 4V2a2 2 0 0 0-2 2h2Zm2-3v3h2V1H4Zm5 0v3h2V1H9Zm5 0v3h2V1h-2ZM1 8h18V6H1v2Zm3 3v.01h2V11H4Zm1 1.01h.01v-2H5v2Zm1.01-1V11h-2v.01h2Zm-1-1.01H5v2h.01v-2ZM9 11v.01h2V11H9Zm1 1.01h.01v-2H10v2Zm1.01-1V11h-2v.01h2Zm-1-1.01H10v2h.01v-2ZM9 15v.01h2V15H9Zm1 1.01h.01v-2H10v2Zm1.01-1V15h-2v.01h2Zm-1-1.01H10v2h.01v-2ZM14 15v.01h2V15h-2Zm1 1.01h.01v-2H15v2Zm1.01-1V15h-2v.01h2Zm-1-1.01H15v2h.01v-2ZM14 11v.01h2V11h-2Zm1 1.01h.01v-2H15v2Zm1.01-1V11h-2v.01h2Zm-1-1.01H15v2h.01v-2ZM4 15v.01h2V15H4Zm1 1.01h.01v-2H5v2Zm1.01-1V15h-2v.01h2Zm-1-1.01H5v2h.01v-2Z"
                      />
                    </svg>
                  </span>
                  <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-black">
                  Grandfather
                  </h3>
                  <time className="block mb-3 text-sm font-normal leading-none text-gray-500 dark:text-gray-400">
                    <ul>
                    {/* {relatives&&relatives.Grandfather&&relatives.Grandfather.length>0&&relatives.Grandfather.map((el, i) => {
                      return(
                        <>
                          <li className="py-1">
                          Grandfather {i+1+': '}
                            {typeof(el)==='object'?<Link to={`/${el.CusName}`}>{el.CusName}</Link>:el}
                          </li>
                        </>
                      )
                    })} */}
                      <li>{relatives.grandfather}</li>
                    </ul>
                  </time>
                  {/* <button
                    type="button"
                    className="py-2 px-3 inline-flex items-center text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    <svg
                      className="w-3 h-3 me-1.5"
                      aria-hidden="true"
                      viewBox="0 0 30 45"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.50012 45C11.6401 45 15.0002 41.6399 15.0002 37.4999V29.9999H7.50012C3.36009 29.9999 0 33.3599 0 37.4999C0 41.6399 3.36009 45 7.50012 45Z"
                        fill="#0ACF83"
                      />
                      <path
                        d="M0 22.5C0 18.36 3.36009 14.9999 7.50012 14.9999H15.0002V29.9999H7.50012C3.36009 30.0001 0 26.64 0 22.5Z"
                        fill="#A259FF"
                      />
                      <path
                        d="M0 7.50006C0 3.36006 3.36009 0 7.50012 0H15.0002V14.9999H7.50012C3.36009 14.9999 0 11.6401 0 7.50006Z"
                        fill="#F24E1E"
                      />
                      <path
                        d="M15.0002 0H22.4999C26.6399 0 30 3.36006 30 7.50006C30 11.6401 26.6399 14.9999 22.4999 14.9999L15.0002 14.9999V0Z"
                        fill="#FF7262"
                      />
                      <path
                        d="M30 22.5C30 26.64 26.6399 30 22.4999 30C18.3599 30 14.9998 26.64 14.9998 22.5C14.9998 18.36 18.3599 14.9999 22.4999 14.9999C26.6399 14.9999 30 18.36 30 22.5Z"
                        fill="#1ABCFE"
                      />
                    </svg>
                    Children details
                  </button> */}
                </li>
              </ol>
              <button
                onClick={closeModal}
                className="text-white inline-flex w-full justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    portalDiv
  );
};

export default MemberDetailModal;
