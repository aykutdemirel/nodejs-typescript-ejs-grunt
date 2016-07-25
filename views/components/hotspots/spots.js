var data = {};

// this part developed using by module design pattern for helpers functions

var helpers = function(){

    var self = {};

    self.getWindowSize = function () {

        var size = {width:0,height:0};

        if (self.innerWidth) {
            size.width = self.innerWidth;
        }
        else if (document.documentElement && document.documentElement.clientHeight){
            size.width = document.documentElement.clientWidth;
        }
        else if (document.body) {
            size.width = document.body.clientWidth;
        }

        if (self.innerHeight) {
            size.height = self.innerHeight;
        }else if (document.documentElement && document.documentElement.clientHeight) {
            size.height = document.documentElement.clientHeight;
        }else if (document.body) {
            size.height = document.body.clientHeight;
        }

        return size;
    };

    self.init = function () {
        // if we need another initialize method, we run at here

        return self;
    }

    return self;

}().init();

//minipopup
var MiniPopup = React.createClass({
    render:function () {
        return(
            <span ref="minipopup" id="minipopup" className={this.props.visibility ? "minipopup active opacity-1 "+this.props.popupPosition + " " + this.props.mobile :"minipopup "+this.props.popupPosition + " "+ this.props.mobile}>
                <h4>{this.props.title}</h4>
                <p>{this.props.body}</p>
            </span>
        )
    }
});


//spot button
var SpotButton = React.createClass({
    getInitialState: function() {
        return {
            condition: false,
            isMobile: false
        }
    },
    handleClick:function () {

        var windowSize = helpers.getWindowSize();

        if(windowSize.width<767){

            this.setState({
                condition: !this.state.condition,
                isMobile: true
            });

            if(!this.state.condition){
                document.body.style.overflow = "hidden";
            }else{
                document.body.style.overflow = "auto";
            }

            this.refs.minitemplate.refs.minipopup.style.height = windowSize.height + "px";

        }else{

            if(!this.state.condition){
                document.body.style.overflow = "hidden";
            }else{
                document.body.style.overflow = "auto";
            }

            document.body.style.overflow = "auto";

            this.refs.minitemplate.refs.minipopup.style.height = "auto";

            this.setState({
                condition: !this.state.condition,
                isMobile: false
            });

        }

        this.refs.minitemplate.refs.minipopup.style.top = (((this.refs.minitemplate.refs.minipopup.offsetHeight*-1)/2)+25) + "px";
    },
    render: function () {
        return (
            <span ref="spotButton" onClick={this.handleClick} className={this.state.condition ? "plus-btn-wrapper on" :"plus-btn-wrapper"} data-x={this.props.position[0]} data-y={this.props.position[1]} >
                <span className="plus-btn">
                    <span className="glyphicon glyphicon-plus"></span>
                </span>
                <MiniPopup ref="minitemplate" popupPosition={this.props.popupPosition} title={this.props.title} body={this.props.body} visibility={this.state.condition} mobile={this.state.isMobile?"mobile":""} />
            </span>
        )
    }
});


//smallspot

var SmallSpot = React.createClass({
    render: function() {
        return (
            <div className="col-md-5 col-sm-5 col-xs-12 p-0 pr-9">
                <div className="imgScl">
                    <img src={data.module.hotSpots.image.imageFamily.images.desktop.internalUrl[0]} className="scale" data-scale="best-fill" data-align="top-left" />
                </div>
                <SpotButton popupPosition="right" position={data.module.hotSpots.popups[0].config.coords} title={data.module.hotSpots.popups[0].headline} body={data.module.hotSpots.popups[0].bodyCopy} />
            </div>
        );
    }
});

//largespot
var LargeSpot = React.createClass({
    render: function() {
        return (
            <div className="col-md-7 col-sm-7 col-xs-12 p-0 pl-9">
                <div className="imgScl">
                    <img src={data.module.hotSpots.image.imageFamily.images.desktop.internalUrl[1]} className="scale" data-scale="best-fill" data-align="bottom-right" />
                </div>
                <SpotButton popupPosition="left" position={data.module.hotSpots.popups[1].config.coords} title={data.module.hotSpots.popups[1].headline} body={data.module.hotSpots.popups[1].bodyCopy} />
            </div>
        );
    }
});

//data loaded using by requirejs and our module starts
require(['data'],function () {

    data = window.data;

    var Spots = React.createClass({
        componentDidMount: function() {
            require(['scaleImg'],function () {
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


