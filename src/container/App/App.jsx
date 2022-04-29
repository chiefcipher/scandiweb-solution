import React from 'react'
import { Route,  Routes } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions'
import * as actionCreators from '../../store/actionCreators'
import Navigation from '../../components/Navigation/Navigation';
import Category  from '../../components/Category/Category';
import Cart from '../../components/Cart/Cart';
import PDP from '../../components/PDP/PDP'
import Backdrop  from '../../UI/Backdrop/Backdrop';
import SelectAttribute from '../../components/AttributeModal/AttributeModal'
import './combine-styles.scss'

import { LOAD_CATEGORIES } from '../../graphql/query'; 


class App extends React.PureComponent  {


  componentDidMount = ()=> {

    fetch("http://localhost:4000/graphql" , { 
            method :    "POST" ,
            headers : {
                'Content-Type' : 'application/json' ,
                'Accept' : 'application/json'
            },
            body : JSON.stringify({query : LOAD_CATEGORIES})
        }).then(response => response.json())
        .then(result => {

              let routes = [...result.data.categories].map ( item => item.name )  ;
              
              this.props.populateData({
                routes : routes , 
                categories : result.data.categories
              })
              
              
        })
        .catch(e => this.props.catchNetworkError(e))

    
  }

  render () { 

    const  {routes} = this.props ;
    if (this.props.netWorkErrorStatus){ 
      console.log('[NETOWRK INFORMATION]' , this.props.netWorkErrorInformation)
    }
    const appContent = this.props.netWorkErrorStatus === false ? 
          <>
                <Navigation   /> 
                <Routes>
                  {
                    routes.map( (item , i ) =>   
                    <Route 
                      key={i}
                      path={'/' + item}  element={<Category show={item} />} />
                  ) } 
                  <Route path='/cart' exact element={<Cart />} /> 
                  <Route path='/pdp' exact element={<PDP />} /> 
                  
                </Routes>

              <Backdrop /> 
              {
                this.props.showAttributeModal ?<SelectAttribute /> : null   
              }
      
          </> : 
          <>
            <h1>error asscessing internet, please check to ensure you have internet connection </h1>
            
          </>

    return (

      <div className="App"  >
          {appContent}
      </div>
    );
  }
  
}

const mapStateToProps = state => {
  return { 
    routes : state.routes ,
    showAttributeModal : state.pdp.showAttributeModal , 
    netWorkErrorStatus : state.hasNetworkError.status , 
    netWorkErrorInformation : state.hasNetworkError.error 
  }
}

const mapDispatchToProps = dispatch => {
  return {
     populateData : (payload)=> dispatch(actionCreators.populateData(payload)),
     catchNetworkError : (e)=> dispatch(actionCreators.setNetworkError(e))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
