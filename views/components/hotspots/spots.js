
var SpotButton = React.createClass({
    getInitialState: function() {
        return {
            condition: false
        }
    },
    handleClick:function () {
        alert('test');
        this.setState( { condition : !this.state.condition } );
    },
    render: function () {
        return (
            <span className={this.state.condition ? "plus-btn-wrapper on" :"plus-btn-wrapper"} data-x={this.props.position[0]} data-y={this.props.position[1]} >
                <span className="plus-btn" onClick={this.handleClick}>
                    <span className="glyphicon glyphicon-plus"></span>
                </span>
            </span>
        )
    }
});

var LargeSpot = React.createClass({
    render: function() {
        return (
            <div className="col-xs-7 p-0 pl-9 col-2">
                <div className="imgScl">
                    <img src="assets/img/img-2.jpg" className="scale" data-scale="best-fill" data-align="bottom-right" />
                    <SpotButton position={data.module.hotSpots.popups[1].config.coords} />
                </div>
            </div>
        );
    }
});

var SmallSpot = React.createClass({
    render: function() {
        return (
            <div className="col-xs-5 p-0 pr-9 col-1">
                <div className="imgScl">
                    <img src="assets/img/img-1.jpg" className="scale" data-scale="best-fill" data-align="top-left" />
                    <SpotButton position={data.module.hotSpots.popups[0].config.coords} />
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


