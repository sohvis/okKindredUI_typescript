import L, {Icon, DivIcon, PointExpression} from 'leaflet';

export default class MapMarkerOptions implements L.MarkerOptions {

    public personId: string;

    public icon?: Icon | DivIcon;
    /** Whether the marker is draggable with mouse/touch or not. */
    public draggable?: boolean;
    /** Whether the marker can be tabbed to with a keyboard and clicked by pressing enter. */
    public keyboard?: boolean;
    /** Text for the browser tooltip that appear on marker hover (no tooltip by default). */
    public title?: string;
    /** Text for the `alt` attribute of the icon image (useful for accessibility). */
    public alt?: string;
    /** Option for putting the marker on top of all others (or below). */
    public zIndexOffset?: number;
    /** The opacity of the marker. */
    public opacity?: number;
    /** If `true`, the marker will get on top of others when you hover the mouse over it. */
    public riseOnHover?: boolean;
    /** The z-index offset used for the `riseOnHover` feature. */
    public riseOffset?: number;
    /** `Map pane` where the markers shadow will be added. */
    public shadowPane?: string;
    /** Whether to pan the map when dragging this marker near its edge or not. */
    public autoPan?: boolean;
    /** Distance (in pixels to the left/right and to the top/bottom) of the map edge to start panning the map. */
    public autoPanPadding?: PointExpression;
    /** Number of pixels the map should pan by. */
    public autoPanSpeed?: number;

    constructor(personId: string) {
        this.personId = personId;
    }
}
