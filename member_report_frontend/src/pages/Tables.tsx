import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import TableOne from '../components/Tables/TableOne';
import TableTwo from '../components/Tables/TableTwo';
import TableThree from '../components/Tables/TableThree';

const Tables = () => {
  return (
    <>
      <Breadcrumb pageName="All Members" />

      <div className="flex flex-col gap-10">
        {/* <TableOne />
        <TableTwo /> */}
        <TableThree />
      </div>
    </>
  );
};

export default Tables;
