
import React from 'react' ; 
import {connect} from 'react-redux' ; 

import * as actionCreators from '../../store/actionCreators'
const Backdrop = props => { 
    return(
        <div className="backdrop" style={{display :props.showBackdrop ? 'block' : 'none'}} onClick={props.toggleBackdrop}>

        </div>
    )
}


const mapStateToProps = state => {
    return { 
        showBackdrop : state.showBackdrop
    }
}


const mapDispatchToProps = dispatch => { 
    return { 
        toggleBackdrop : ()=> dispatch(actionCreators.toggleBackdrop())
    }
}
export default connect(mapStateToProps , mapDispatchToProps)(Backdrop)