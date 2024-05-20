import React, { useState } from 'react';
import CommonLayout from '../../components/shop/common-layout';
// import { withApollo } from '../../helpers/apollo/apollo';
import ProductList from './common/productList';
import { Container, Row} from 'reactstrap';
import FilterPage from './common/filter';

const LeftSidebar = () => {

    const [sidebarView,setSidebarView] = useState(false)
    
    const openCloseSidebar = () => {
        if(sidebarView){
            setSidebarView(!sidebarView)
        } else {
            setSidebarView(!sidebarView)
        }
    }
    return (
        <CommonLayout title="all products" parent="home" >
            <section className="section-b-space ratio_asos" style={{background:"#FAFAFA"}}>
                                            <FilterPage sm="3" sidebarView={sidebarView} closeSidebar={() => openCloseSidebar(sidebarView)} />

                <div className="collection-wrapper" style={sidebarView ? {marginLeft:"125px"} : {}}>
                    <Container  style={sidebarView ? {maxWidth:"1280px"} : {}}>
                        <Row>
                         
                            <ProductList colClass="col-xl-3 col-6 col-grid-box" layoutList=''  openSidebar={() => openCloseSidebar(sidebarView) } />
                        </Row>
                    </Container>
                </div>
            </section>
        </CommonLayout>
    )
}

export default LeftSidebar;