import React from 'react';
import { useRouter } from 'next/router'
import CommonLayout from '../../components/shop/common-layout';
// import { withApollo } from '../../helpers/apollo/apollo';
import LeftSidebarPage from './product/leftSidebarPage';

const LeftSidebar = () => {
  
  const router = useRouter();
  const id = router.asPath.split("/")[2].split("-")[0];
  
  return (
    <CommonLayout parent="Home" title="Product">
        <LeftSidebarPage pathId={id} />
        {/* console.log({related_ids}); */}
    </CommonLayout>
  );
}


export default LeftSidebar;