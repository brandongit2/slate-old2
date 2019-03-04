import {connect} from 'react-redux';

import {hideModal} from '../actions';

import css from './Modal.scss';

function Modal(props) {
    return (
        <div className={[css.background, props.isVisible ? css.visible : ''].join(' ')} onClick={props.hideModal}>
            <div className={css.modal}>
                {props.hasX ? <i className="material-icons" onClick={props.hideModal}>close</i> : null}
                <p id={css.title}>{props.title}</p>
                <p id={css.content}>{props.content}</p>
                <div id={css.buttons}>
                    <div style={{width: '2rem'}} />
                    {props.buttons.map(button => (
                        <button key={button[0]}
                                className={[button[2], css.button].join(' ')}
                                onClick={button[3]}>
                            {button[1]}
                        </button>
                    ))}
                    <div style={{width: '2rem'}} />
                </div>
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        isVisible: state.modal.isVisible,
        title:     state.modal.title,
        content:   state.modal.content,
        buttons:   state.modal.buttons,
        hasX:      state.modal.hasX
    };
}

const actionCreators = {
    hideModal
};

export default connect(mapStateToProps, actionCreators)(Modal);
