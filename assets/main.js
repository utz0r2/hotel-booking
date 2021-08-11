"use strict";

const store = new Vuex.Store({
    state: {
        settings: [],
        rooms: [],
        roomtypes: [],
        init_scheduler: false,
    },
    getters: {
        allSettings: (state) => state.settings,
        allRooms: (state) => state.rooms,
        allRoomTypes: (state) => state.roomtypes,
        initScheduler: (state) => state.init_scheduler,
    },
    mutations: {
        getSettings(state) {
            axios
                .get(ajaxurl + '?action=hb_get_settings')
                .then(response => (state.settings = response.data))
                .catch(error => console.log(error));
        },
        storeSettings(state) {
            axios
                .post(ajaxurl + '?action=hb_store_settings', Qs.stringify(state.settings))
                .then(response => state.settings = response.data)
                .catch(error => console.log(error));
        },
        addCUR(state, tmp) {
            state.settings.CUR.push(tmp);
        },
        addPROMO(state, tmp) {
            state.settings.PROMO.push(tmp);
        },
        getRooms(state) {
            if (state.rooms.length === 0) {
                axios
                    .get(ajaxurl + '?action=hb_get_rooms')
                    .then(response => (state.rooms = response.data))
                    .catch(error => console.log(error));
            }
        },
        getRoomTypes(state) {
            if (state.roomtypes.length === 0) {
                axios
                    .get(ajaxurl + '?action=hb_get_room_types')
                    .then(response => (state.roomtypes = response.data))
                    .catch(error => console.log(error));
            }
        },
        addRoom(state, tmp) {
            axios
                .post(ajaxurl + '?action=hb_add_room', Qs.stringify(tmp))
                .then(response => state.rooms = response.data)
                .catch(error => console.log(error));
        },
        setInitScheduler(state, flag) {
            state.init_scheduler = flag;
        },
        // delRoom(state, {id}) {
        //     axios
        //         .post(ajaxurl + '?action=hb_delete_room', Qs.stringify({'id':id}))
        //         // .then(response => state.settings = response.data)
        //         .catch(error => console.log(error));
        // },
    },
    actions: {
        getSettings: ({commit}) => {
            commit("getSettings");
        },
        storeSettings: ({commit}) => {
            commit("storeSettings");
        },
        addCUR: ({commit}, tmp) => {
            commit("addCUR", tmp);
        },
        addPROMO: ({commit}, tmp) => {
            commit("addPROMO", tmp);
        },
        getRooms: ({commit}) => {
            commit("getRooms");
        },
        getRoomTypes: ({commit}) => {
            commit("getRoomTypes");
        },
        addRoom: ({commit}, tmp) => {
            commit("addRoom", tmp);
        },
        setInitScheduler: ({commit}, flag) => {
            commit("setInitScheduler", flag);
        },
        // delRoom: ({commit}, {id}) => {
        //     commit("delRoom", {id});
        // },
    },
});

const Dashboard = {
    mounted() {

        // console.log(this.$store.getters.initScheduler);

        // if ( this.$store.getters.initScheduler === false ) {

        scheduler.locale.labels.section_fullname = 'Fullname';
        scheduler.locale.labels.section_email = 'Email';
        scheduler.locale.labels.section_tel = 'Phone';
        scheduler.locale.labels.section_room = 'Room';
        scheduler.locale.labels.section_noty = 'Noty';
        scheduler.locale.labels.section_status = 'Status';
        scheduler.locale.labels.section_is_paid = 'Paid';
        scheduler.locale.labels.section_time = 'Date';
        scheduler.xy.scale_height = 30;
        scheduler.config.details_on_create = true;
        scheduler.config.details_on_dblclick = true;
        //scheduler.config.prevent_cache = true;
        scheduler.config.show_loading = true;
        scheduler.config.buttons_left = ["dhx_delete_btn"];
        scheduler.config.buttons_right = ["dhx_save_btn", "dhx_cancel_btn"];
        //scheduler.config.drag_lightbox = false;

        var roomsArr = scheduler.serverList("room");
        var roomTypesArr = scheduler.serverList("roomType");
        var roomStatusesArr = scheduler.serverList("roomStatus");
        var bookingStatusesArr = scheduler.serverList("bookingStatus");

        scheduler.config.lightbox.sections = [
            {map_to: "fullname", name: "fullname", type: "textarea", height: 30},
            {map_to: "email", name: "Email", type: "textarea", height: 30},
            {map_to: "tel", name: "Phone", type: "textarea", height: 30},
            {map_to: "noty", name: "Noty", type: "textarea", height: 30},
            {map_to: "room", name: "Room", type: "select", options: scheduler.serverList("currentRooms")},
            {map_to: "status", name: "status", type: "radio", options: scheduler.serverList("bookingStatus")},
            {map_to: "is_paid", name: "is_paid", type: "checkbox", checked_value: 1, unchecked_value: 0},
            {map_to: "time", name: "time", type: "calendar_time"}
        ];


        scheduler.locale.labels.timeline_tab = 'Timeline';

        scheduler.createTimelineView({
            fit_events: true,
            name: "timeline",
            y_property: "room",
            // render: 'tree',
            render: 'bar',
            x_unit: "day",
            x_date: "%d",
            x_size: 31,
            // x_step: 1,
            // x_size: 2,
            // x_start: 0,
            // x_length: 2,
            dy: 32,
            event_dy: 'full',
            // event_dy: 48,
            section_autoheight: false,
            round_position: true,
            // scrollable: true,
            y_unit: scheduler.serverList("currentRooms"),
            second_scale: {
                x_unit: "month",
                x_date: "%F"
            }
        })

        var headerHTML = "<div class='timeline_item_separator'></div>" +
            "<div class='timeline_item_cell'>Number</div>" +
            "<div class='timeline_item_separator'></div>" +
            "<div class='timeline_item_cell'>Type</div>" +
            "<div class='timeline_item_separator'></div>" +
            "<div class='timeline_item_cell room_status'>Status</div>";

        scheduler.locale.labels.timeline_scale_header = headerHTML;

        function findInArray(array, key) {
            for (var i = 0; i < array.length; i++) {
                if (key == array[i].key)
                    return array[i];
            }
            return null;
        }

        function getRoomType(key) {
            return findInArray(roomTypesArr, key).label;
        }

        function getRoomStatus(key) {
            return findInArray(roomStatusesArr, key);
        }

        function getRoom(key) {
            return findInArray(roomsArr, key);
        }

        scheduler.templates.timeline_scale_label = function (key, label, section) {
            var roomStatus = getRoomStatus(section.status);
            return ["<div class='timeline_item_separator'></div>",
                "<div class='timeline_item_cell'>" + label + "</div>",
                "<div class='timeline_item_separator'></div>",
                "<div class='timeline_item_cell'>" + getRoomType(section.type) + "</div>",
                "<div class='timeline_item_separator'></div>",
                "<div class='timeline_item_cell room_status'>",
                "<span class='room_status_indicator room_status_indicator_" + roomStatus.id + "'></span>",
                "<span class='status-label'>" + roomStatus.label + "</span>",
                "</div>"].join("");
        };

        // scheduler.date.timeline_start = scheduler.date.month_start;
        // scheduler.date.add_timeline = function (date, step) {
        //     return scheduler.date.add(date, step, "month");
        // };

        scheduler.attachEvent("onBeforeViewChange", function (old_mode, old_date, mode, date) {
            var year = date.getFullYear();
            var month = (date.getMonth() + 1);
            var d = new Date(year, month, 0);
            var daysInMonth = d.getDate();
            var timeline = scheduler.getView('timeline');
            timeline.x_size = daysInMonth;
            return true;
        });

        scheduler.templates.event_class = function (start, end, event) {
            return "event_" + (event.status || "");
        };

        function getBookingStatus(key) {
            var bookingStatus = findInArray(bookingStatusesArr, key);
            return !bookingStatus ? '' : bookingStatus.label;
        }

        function getPaidStatus(isPaid) {
            return isPaid ? "💶" : "";
        }

        var eventDateFormat = scheduler.date.date_to_str("%d %M %Y");
        scheduler.templates.event_bar_text = function (start, end, event) {
            // return '';
            var paidStatus = getPaidStatus(event.is_paid);
            var startDate = eventDateFormat(event.start_date);
            var endDate = eventDateFormat(event.end_date);
            return [event.text + "<br />",
                // startDate + " - " + endDate,
                // "<div class='booking_status booking-option'>" + getBookingStatus(event.status) + "</div>",
                "<div class='booking_paid booking-option'>" + paidStatus + "</div>"].join("");
        };

        scheduler.templates.tooltip_text = function (start, end, event) {
            var room = getRoom(event.room) || { label: "" };

            var html = [];
            // html.push("Booking: <b>" + event.text + "</b>");
            html.push("Room: <b>" + room.label + "</b>");
            html.push("Check-in: <b>" + eventDateFormat(start) + "</b>");
            html.push("Check-out: <b>" + eventDateFormat(end) + "</b>");
            html.push(getBookingStatus(event.status) + ", " + getPaidStatus(event.is_paid));
            return html.join("<br>")
        };

        scheduler.templates.lightbox_header = function (start, end, ev) {
            var formatFunc = scheduler.date.date_to_str('%d.%m.%Y');
            return formatFunc(start) + " - " + formatFunc(end);
        };

        scheduler.attachEvent("onEventCollision", function (ev, evs) {
            for (var i = 0; i < evs.length; i++) {
                if (ev.room != evs[i].room) continue;
                dhtmlx.message({
                    type: "error",
                    text: "This room is already booked for this date."
                });
            }
            return true;
        });

        scheduler.attachEvent('onEventCreated', function (event_id) {
            var ev = scheduler.getEvent(event_id);
            ev.status = 1;
            ev.is_paid = false;
            // ev.text = 'New booking';
        });

        scheduler.addMarkedTimespan({ days: [0, 6], zones: "fullday", css: "timeline_weekend" });

        window.showRooms = function showRooms(value) {
            var currentRoomsArr = [];
            if (value == 'all') {
                scheduler.updateCollection("currentRooms", roomsArr.slice());
                return
            }
            for (var i = 0; i < roomsArr.length; i++) {
                if (value == roomsArr[i].type) {
                    currentRoomsArr.push(roomsArr[i]);
                }
            }
            scheduler.updateCollection("currentRooms", currentRoomsArr);
        };

        scheduler.attachEvent("onLoadEnd", function () {
            showRooms("all");

            var select = document.getElementById("room_filter");
            var selectHTML = ["<option value='all'>All</option>"];
            for (var i = 1; i < roomTypesArr.length + 1; i++) {
                selectHTML.push("<option value='" + i + "'>" + getRoomType(i) + "</option>");
            }
            select.innerHTML = selectHTML.join("");
        });


        scheduler.attachEvent("onEventSave", function (id, ev, is_new) {
            if (!ev.fullname) {
                dhtmlx.alert("Full name is required!");
                return false;
            }
            return true;
        });
/*        var dhxMessageConfig = {
            position: "top-right",
            text: "Changes saved in the database",
            expire: 1500,
            node: "scheduler_here"
        };

        scheduler.attachEvent("onEventChanged", function (id, ev) {
            dhx.message(dhxMessageConfig);
        });

        scheduler.attachEvent("onEventDeleted", function (id, ev) {
            dhx.message(dhxMessageConfig);
        });*/

        scheduler.clearAll();
        scheduler.init('scheduler_here', new Date(), "timeline");
        scheduler.load(ajaxurl + "?action=hb_get_data", "json");
        if (typeof window.dp == 'undefined') {
            window.dp = new dataProcessor(ajaxurl + "?action=hb_get_data");
            dp.init(scheduler);
            // disable style updates on add/upd/del
            dp.styles = "";
        }


    },
    created () {

    },
    methods: {},
    template: `<div>
            <div id="scheduler_here" class="dhx_cal_container" style='width:100%; height:600px;'>
                <div class="dhx_cal_navline">
                    <div style="font-size:16px;padding:4px 20px;">
                        Filter by Type:
                        <select id="room_filter" onchange='showRooms(this.value)'></select>
                    </div>
                    <div class="dhx_cal_prev_button">&nbsp;</div>
                    <div class="dhx_cal_next_button">&nbsp;</div>
                    <div class="dhx_cal_today_button"></div>
                    <div class="dhx_cal_date"></div>
                </div>
                <div class="dhx_cal_header"></div>
                <div class="dhx_cal_data"></div>
            </div>
        </div>`
}

const RoomTypes = {
    mounted() {
        this.$store.dispatch('getRoomTypes')
    },
    template: `<div>

            <a href="#TB_inline?width=500&inlineId=modal-window-add" class="button button-primary thickbox" style="float:right;">
                <span class="dashicons dashicons-plus" style="line-height: 32px;" ></span>
            </a>
            <div id="modal-window-add" style="display:none;">
                <div style="padding-top:5px;">

                    <input type="text" placeholder="Title">
                    <input type="text" placeholder="Shortcode">
                    <input type="text" style="width:80px;" placeholder="Area"> м<sup>2</sup>

                    <h4 style="margin-bottom:0; margin:5px 0;">Additional Services</h4>
                    <label style="margin-right:15px;" v-for="item in store.getters.allSettings.BOOKING_STATUS">
                        <input type="checkbox" name="add_services[]" value="2" checked=""> {{ item }}
                    </label>

                    <div style="clear:both"></div>


                    <div style="background:#f7f7f7;">
                        <h4 style="margin-bottom:0; margin:5px 0;">Capacity</h4>
                        <div style="width:50%; float:left">

                            <div style="margin-bottom:5px" v-for="item in store.getters.allSettings.SETS_LIST">
                                <div style="width:70%; float:left">
                                    <input type="text" placeholder="Price by {{ item }}">
                                </div>
                                <div style="width:30%; float:left; line-height:30px;">
                                    {{ item }}
                                </div>
                                <div style="clear:both"></div>
                            </div>


                        </div>
                        <div style="width:50%; float:left">

                            Picture
                            <div class="row" id="images_result"></div>
                            <input type="file" class="form-control" onchange="images_upload()" name="images[]" accept="image/jpeg,image/png,image/gif" multiple="">
                            <div class="progress progress_images" style="display:none">
                                <div class="images-bar progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>

                        </div>
                        <div style="clear:both"></div>
                    </div>

                    <h4 style="margin-bottom:0; margin:5px 0;">Comfort</h4>
                    <label style="margin-right:15px; float:left; width:20%;" v-for="item in store.getters.allSettings.COMFORTS_LIST">
                        <input type="checkbox" name="comfort[]" value="5" checked=""> {{ item }}
                    </label>

                    <div style="clear:both"></div>


                    <input type="text" placeholder="Capacity text">

                    <div style="clear:both"></div>

                    <textarea rows="3" placeholder="Description"></textarea>

                    <div style="clear:both"></div>

                    <button type="submit" name="add" class="button button-primary">
                        Добавить
                    </button>

                </div>
            </div>

            <h3>Room Types</h3>

            <table class="widefat striped">
                <thead>
                <tr>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Area</th>
                    <th>Capacity</th>
                    <th>Price</th>
                    <th style="width:50px"></th>
                    <th style="width:50px"></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in store.getters.allRoomTypes">
                    <td class="align-middle">
                        #
                    </td>
                    <td class="align-middle">
                        <b>{{ item.shortcode }}</b><br>
                        {{ item.title }}
                    </td>
                    <td class="align-middle">
                        {{ item.area }}
                    </td>
                    <td class="align-middle">
                        <div v-for="(cap, ci ) in JSON.parse(item.capacity)">
                         {{ cap ? ci : ''  }}
                        </div>
                    </td>
                    <td class="align-middle">
                        <div v-for="(cap, ci ) in JSON.parse(item.capacity)">
                         {{ cap }}
                        </div>
                    </td>
                    <td style="text-align:right;">
                        <a href="#" class="button button-primary button-small" style="background: #FFB900;border:1px solid #FFB900;">
                            <span class="dashicons dashicons-edit" style="line-height: 24px;"></span>
                        </a>
                    </td>
                    <td style="text-align:right;">
                        <a href="#" class="button button-primary button-small" style="background: #DC3232;border:1px solid #DC3232;">
                            <span class="dashicons dashicons-trash" style="line-height: 24px;"></span>
                        </a>
                    </td>
                </tr>
                </tbody>
            </table>

        </div>`
}

const Rooms = {
    data() {
        return {
            tmpRoom: {
                name: '',
                type_id: '',
                cleaner: '',
                status: 1,
            },
        }
    },
    mounted() {
        this.$store.dispatch('getRooms')
    },
    methods: {
        addRoom() {
            this.$store.dispatch("addRoom", this.tmpRoom);
            jQuery('#TB_closeWindowButton').click();
        },
        delRoom(id, index0, index1) {
            // this.$store.dispatch("delRoom", {id});

            axios
                .post(ajaxurl + '?action=hb_delete_room', Qs.stringify({'id': id}))
                //.then(response => state.rooms = response.data)
                .catch(error => console.log(error));

            Vue.delete(this.$store.state.rooms[index0], index1)

        },
        switchRoomStatus(id, status) {
            axios
                .post(ajaxurl + '?action=hb_switch_room_status', Qs.stringify({'id': id, 'status': status}))
                //.then(response => state.rooms = response.data)
                .catch(error => console.log(error));
        },
        updateRoom(id, cleaner) {

            // console.log(id, cleaner)

            axios
                .post(ajaxurl + '?action=hb_update_room', Qs.stringify({'id': id, 'cleaner': cleaner}))
                //.then(response => state.rooms = response.data)
                .catch(error => console.log(error));

        }
    },
    template: `<div>

            <a href="#TB_inline?width=500&height=45&inlineId=modal-window-add" class="button button-primary thickbox" style="float:right;">
                <span class="dashicons dashicons-plus" style="line-height: 32px;" ></span>
            </a>
            <div id="modal-window-add" style="display:none;">
                <div style=" padding-top:5px;">
                    <input type="text" placeholder="Title" v-model="tmpRoom.name">
                    <select v-model="tmpRoom.type_id">
                        <option v-for="(option, index) in store.getters.allRooms" :value="index.split('|')[1]">{{ index.split('|')[0] }}</option>
                    </select>
                    <select v-model="tmpRoom.cleaner">
                        <option v-for="option in store.getters.allSettings.ROOM_STATUSES" :value="option">{{ option }}</option>
                    </select>
                    <select v-model="tmpRoom.status">
                        <option value="1">on</option>
                        <option value="0">off</option>
                    </select>
                    <button type="button" class="button button-primary" @click="addRoom">
                        Add New Room
                    </button>
                </div>
            </div>
            
            <h3>Rooms</h3>

            <div class="row">
                <div class="column" v-for="(room, index0) in store.getters.allRooms">
                    <table class="widefat striped">
                    <thead>
                    <tr>
                        <th colspan="5">
                            <h4 style="margin:0">{{ index0.split('|')[0] }}</h4>
                        </th>
                    </tr>
                    <tr>
                        <th>Room</th>
                        <th>Type room</th>
                        <th>Cleaning</th>
                        <th style="width:50px"></th>
                        <!-- <th style="width:50px"></th> -->
                        <th style="width:50px"></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index1) in room">
                        <td>
                            {{ item.name }}
                        </td>
                        <td>
                            {{ item.type }}
                        </td>
                        <td>
                            <select v-model="item.cleaner" @change="updateRoom(item.id, item.cleaner)">
                                <option v-for="option in store.getters.allSettings.ROOM_STATUSES" :value="option">{{ option }}</option>
                            </select>
                        </td>
                        <td style="text-align:right;">
                            <span v-if="item.status == 1">
                                <button @click="switchRoomStatus(item.id, item.status); item.status = 0" type="button" class="button button-primary button-small" style="background:#46B450; border:1px solid #46B450">
                                    <span class="dashicons dashicons-visibility" style="line-height: 24px;"></span>
                                </button>
                            </span>
                            <span v-else>
                                <button @click="switchRoomStatus(item.id, item.status); item.status = 1" type="button" class="button button-primary button-small" style="background:#ccc; border:1px solid #ccc">
                                    <span class="dashicons dashicons-visibility" style="line-height: 24px;"></span>
                                </button>
                            </span>
                        </td>
                        <!--
                        <td style="text-align:right;">
                            <a href="#" class="button button-primary button-small" style="background:#FFB900; border:1px solid #FFB900">
                                <span class="dashicons dashicons-edit" style="line-height: 24px;"></span>
                            </a>
                        </td>
                        -->
                        <td style="text-align:right;">
                            <button @click="delRoom(item.id, index0, index1)" type="button" class="button button-primary button-small" style="background:#DC3232; border:1px solid #DC3232">
                                <span class="dashicons dashicons-trash" style="line-height: 24px;"></span>
                            </button>
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </div>

        </div>`
}

const Orders = {
    data() {
        return {
            orders: {},
        };
    },
    methods: {
        delOrder(id, index) {
            axios
                .post(ajaxurl + '?action=hb_delete_order', Qs.stringify({'id': id}))
                // .then(response => state.settings = response.data)
                .catch(error => console.log(error));

            this.orders.splice(index, 1)
        },
        getOrder() {
            axios
                .get(ajaxurl + '?action=hb_get_orders')
                .then(response => (this.orders = response.data))
                .catch(error => console.log(error));
        },
    },
    mounted() {
        this.getOrder()
    },
    template: `<div>

        <h3>Orders</h3>

        <table class="widefat striped">
            <thead>
            <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Room</th>
                <th style="width:200px;">Check-in - Check-out date</th>
                <th>Price</th>
                <th>Status</th>
                <th style="width:50px"></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in orders">
                 <td>{{ item.id }}</td>
                <td>
                    {{ item.fullname }}<br>
                    Email: {{ item.email }} <br>Noty: {{ item.noty }}, дней: 2, доп.услуги(Трансфер 1|) , прибытие: 12:00, завтрак: yes, парковка: yes
                </td>
                <td>
                    {{ item.tel }}
                </td>
                <td>
                   {{ item.room }}
                </td>
                <td>
                    {{ item.start_date }} - {{ item.end_date }}
                </td>
                <td>
                    {{ item.cost }}
                </td>
                <td>
                     {{ item.status }} - {{ item.is_paid }}
                </td>
                <td style="text-align:right;">
                    <a href="#" @click="delOrder(item.id, index)" class="button button-primary button-small" style="background: #DC3232;border:1px solid #DC3232;">
                        <span class="dashicons dashicons-trash" style="line-height: 24px"></span>
                    </a>
                </td>
            </tr>
            </tbody>
        </table>
        </div>`
}

const Settings = {
    data() {
        return {
            tmpCur: {},
            tmpPromo: {},
        }
    },
    mounted() {

    },
    methods: {
        changeData() {
            this.$store.dispatch("storeSettings");
        },
        addNewCur() {
            this.$store.dispatch("addCUR", this.tmpCur);
            this.tmpCur = {};
            this.changeData();
        },
        addNewPromo() {
            this.$store.dispatch("addPROMO", this.tmpPromo);
            this.tmpPromo = {};
            this.changeData();
        }
    },
    template: `<div>
            <h3>Settings</h3>

            <div style="width:66%; float:left;">

                <table class="widefat striped">
                    <tr>
                        <th>Room Statuses</th>
                        <td>
                            <input-tag v-model="store.getters.allSettings.ROOM_STATUSES" @input="changeData" :add-tag-on-blur="true"></input-tag>
                        </td>
                    </tr>
                    <tr>
                        <th>Booking Statuses</th>
                        <td>
                            <input-tag v-model="store.getters.allSettings.BOOKING_STATUS" @input="changeData" :add-tag-on-blur="true"></input-tag>
                        </td>
                    </tr>
                    <tr>
                        <th>Comforts List</th>
                        <td>
                            <input-tag v-model="store.getters.allSettings.COMFORTS_LIST" @input="changeData" :add-tag-on-blur="true"></input-tag>
                        </td>
                    </tr>
                    <tr>
                        <th>Services List</th>
                        <td>
                            <input-tag v-model="store.getters.allSettings.SERVICES_LIST" @input="changeData" :add-tag-on-blur="true"></input-tag>
                        </td>
                    </tr>
                    <tr>
                        <th>Sets List</th>
                        <td>
                            <input-tag v-model="store.getters.allSettings.SETS_LIST" @input="changeData" :add-tag-on-blur="true"></input-tag>
                        </td>
                    </tr>
                    <tr>
                        <th><label>Room Images, px</label></th>
                        <td>
                            Large
                            <input style="width:100px; margin-right:15px;" type="number" @input="changeData" v-model="store.getters.allSettings.IMG_LARGE">
                            Medium
                            <input style="width:100px; margin-right:15px;" type="number" @input="changeData" v-model="store.getters.allSettings.IMG_MEDIUM">
                            Small
                            <input style="width:100px;" type="number" @input="changeData" v-model="store.getters.allSettings.IMG_SMALL">
                        </td>
                    </tr>
                </table>

            </div>
            <div style="width:32%; float:left; margin-left:1%;">

                <table class='widefat'>
                    <thead>
                        <tr>
                            <th>Currencies</th>
                            <th>Sign</th>
                            <th>Coef</th>
                            <th style="width:30px; text-align: center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(rowList, index0) in store.getters.allSettings.CUR">
                          <td v-for="(item, index1) in rowList" @change="changeData"><input type="text" style="width:100%;" :value="item" v-model="store.getters.allSettings.CUR[index0][index1]"></td>
                          <td><button @click="store.getters.allSettings.CUR.splice(index0, 1);changeData()" class="button" style="background: #DC3232;color: #fff; line-height: normal; border-color:#DC3232;" type="submit"><span class="dashicons dashicons-trash"></span></button></td>
                        </tr>
                    </tbody>
                    <tr style="background:#f0f6fc;">
                        <td><input v-model="tmpCur[0]" type="text" style="width:100%;" placeholder="Currency" ></td>
                        <td><input v-model="tmpCur[1]" type="text" style="width:100%;" placeholder="Sign" ></td>
                        <td><input v-model="tmpCur[2]" type="text" style="width:100%;" placeholder="Coef" ></td>
                        <td><button @click="addNewCur" class="button-primary button" style="line-height: normal;" type="button"><span class="dashicons dashicons-plus"></span></button></td>
                    </tr>
                </table>

                <br/>

                <table class='widefat'>
                    <thead>
                    <tr>
                        <th>Promocodes</th>
                        <th>Sum</th>
                        <th>Status</th>
                        <th style="width:30px; text-align: center"></th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(rowList, index0) in store.getters.allSettings.PROMO">
                          <td v-for="(item, index1) in rowList" @change="changeData"><input type="text" style="width:100%;" :value="item" v-model="store.getters.allSettings.PROMO[index0][index1]"></td>
                          <td><button  @click="store.getters.allSettings.PROMO.splice(index0, 1);changeData()" class="button" style="background: #DC3232;color: #fff; line-height: normal; border-color:#DC3232;" type="submit"><span class="dashicons dashicons-trash"></span></button></td>
                        </tr>
                    </tbody>
                    <tr style="background:#f0f6fc;">
                        <td><input v-model="tmpPromo[0]" type="text" style="width:100%;" placeholder="Promocode" ></td>
                        <td><input v-model="tmpPromo[1]" type="text" style="width:100%;" placeholder="Sum" ></td>
                        <td><input v-model="tmpPromo[2]" type="text" style="width:100%;" placeholder="Status" ></td>
                        <td><button @click="addNewPromo" class="button-primary button" style="line-height: normal;" type="button"><span class="dashicons dashicons-plus"></span></button></td>
                    </tr>
                </table>


            </div>


        </div>`
}

NProgress.configure({parent: '#app'});

axios.interceptors.request.use(config => {
    NProgress.start()
    return config
})

axios.interceptors.response.use(response => {
    NProgress.done()
    return response
})

const router = new VueRouter({
    routes: [
        {path: "/", component: Dashboard,},
        {path: "/room_types", component: RoomTypes,},
        {path: "/rooms", component: Rooms,},
        {path: "/orders", component: Orders,},
        {path: "/settings", component: Settings,},
    ]
});

Vue.component('input-tag', vueInputTag.default)

const app = new Vue({
    router,
    store,
    el: '#app',
    data() {
        return {
            settings: {},
        }
    },
    mounted() {
        this.$store.dispatch('getSettings')
    },
    created() {
    }
});
