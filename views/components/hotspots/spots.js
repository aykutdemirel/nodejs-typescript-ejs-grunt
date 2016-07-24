
var MiniPopup = React.createClass({
    render:function () {
        return(
            <span ref="minipopup" id="minipopup" className={this.props.visibility ? "minipopup active opacity-1 "+this.props.popupPosition :"minipopup "+this.props.popupPosition}>
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
        this.setState({
            condition: !this.state.condition
        });
        this.refs.minitemplate.refs.minipopup.style.top = (((this.refs.minitemplate.refs.minipopup.offsetHeight*-1)/2)+25) + "px";
    },
    render: function () {
        return (
            <span ref="spotButton" onClick={this.handleClick} className={this.state.condition ? "plus-btn-wrapper on" :"plus-btn-wrapper"} data-x={this.props.position[0]} data-y={this.props.position[1]} >
                <span className="plus-btn">
                    <span className="glyphicon glyphicon-plus"></span>
                </span>
                <MiniPopup ref="minitemplate" popupPosition={this.props.popupPosition} title={this.props.title} body={this.props.body} visibility={this.state.condition} />
            </span>
        )
    }
});

var SmallSpot = React.createClass({
    render: function() {
        return (
            <div className="col-md-5 col-sm-5 col-xs-12 p-0 pr-9">
                <div className="imgScl">
                    <img src="assets/img/img-1.jpg" className="scale" data-scale="best-fill" data-align="top-left" />
                </div>
                <SpotButton popupPosition="right" position={data.module.hotSpots.popups[0].config.coords} title={data.module.hotSpots.popups[0].headline} body={data.module.hotSpots.popups[0].bodyCopy} />
            </div>
        );
    }
});

var LargeSpot = React.createClass({
    render: function() {
        return (
            <div className="col-md-7 col-sm-7 col-xs-12 p-0 pl-9">
                <div className="imgScl">
                    <img src="assets/img/img-2.jpg" className="scale" data-scale="best-fill" data-align="bottom-right" />
                </div>
                <SpotButton popupPosition="left" position={data.module.hotSpots.popups[1].config.coords} title={data.module.hotSpots.popups[1].headline} body={data.module.hotSpots.popups[1].bodyCopy} />
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


