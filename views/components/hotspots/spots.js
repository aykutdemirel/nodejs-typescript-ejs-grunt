function getOffset(elem) {
    var top=0, left=0;
    while(elem) {
        top = top + parseInt(elem.offsetTop);
        left = left + parseInt(elem.offsetLeft);
        elem = elem.offsetParent;
    }
    return {top: top, left: left};
}

var MiniPopup = React.createClass({
    componentDidMount: function() {
        this.refs.minipopup.style.top = (this.props.position.top - (this.refs.minipopup.offsetHeight / 2) + 25) + "px";
        this.refs.minipopup.style.left = (this.props.position.left - this.refs.minipopup.offsetWidth) + "px";
        this.refs.minipopup.setAttribute("class","minipopup opacity-1");
    },
    render:function () {
        return(
            <span ref="minipopup" id="minipopup" className="minipopup">
                <h4>{this.props.title}</h4>
                <p>{this.props.body}</p>
            </span>
        )
    }
});

var SpotButton = React.createClass({
    getInitialState: function() {
        return {
            condition: false
        }
    },
    handleClick:function () {
        var position = getOffset(this.refs.spotButton);
        this.setState({
            condition: !this.state.condition
        });
        var cloneNode = document.getElementById("minipopup");
        if(cloneNode && cloneNode!==null){
            document.getElementById("minipopupWrapper").removeChild(cloneNode);
        }else{
            ReactDOM.render(<MiniPopup title={this.props.title} body={this.props.body} position={position} />,document.getElementById("minipopupWrapper"));
        }

    },
    render: function () {
        return (
            <span ref="spotButton" onClick={this.handleClick} className={this.state.condition ? "plus-btn-wrapper on" :"plus-btn-wrapper"} data-x={this.props.position[0]} data-y={this.props.position[1]} >
                <span className="plus-btn">
                    <span className="glyphicon glyphicon-plus"></span>
                </span>
            </span>
        )
    }
});

var SmallSpot = React.createClass({
    render: function() {
        return (
            <div className="col-xs-5 p-0 pr-9 col-1">
                <div className="imgScl">
                    <img src="assets/img/img-1.jpg" className="scale" data-scale="best-fill" data-align="top-left" />
                    <SpotButton position={data.module.hotSpots.popups[0].config.coords} title={data.module.hotSpots.popups[0].headline} body={data.module.hotSpots.popups[0].bodyCopy} />
                </div>
            </div>
        );
    }
});

var LargeSpot = React.createClass({
    render: function() {
        return (
            <div className="col-xs-7 p-0 pl-9 col-2">
                <div className="imgScl">
                    <img src="assets/img/img-2.jpg" className="scale" data-scale="best-fill" data-align="bottom-right" />
                    <SpotButton position={data.module.hotSpots.popups[1].config.coords} title={data.module.hotSpots.popups[1].headline} body={data.module.hotSpots.popups[1].bodyCopy} />
                </div>
            </div>
        );
    }
});

require(['../assets/js/core/data.js'],function () {
    var Spots = React.createClass({
        componentDidMount: function() {
            require(['../assets/js/core/scaleImg'],function () {
                document.querySelectorAll(".scale").scaleImg();
            });
        },
        render: function() {
            return (
                <div>
                    <SmallSpot />
                    <LargeSpot />
                    <div className="h-18 clear-both"></div>
                </div>
            );
        }
    });
    ReactDOM.render(<Spots />,document.getElementById('hotspots'));
});


