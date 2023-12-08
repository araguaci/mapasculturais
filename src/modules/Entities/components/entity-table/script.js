app.component('entity-table', {
    template: $TEMPLATES['entity-table'],

    setup({ headers }, { slots }) {
        const activeSlots = Object.keys(slots);
        const messages = useMessages();
        const hasSlot = name => !!slots[name];
        const text = Utils.getTexts('entity-table')
        return { optionalHeadersSelected: [], hasSlot, activeSlots, messages, text };
    },

    mounted() {
        this.modifiedHeaders.forEach(header => {
            if (header.visible || header.required) {
                this.addInColumns(header.text);
            }
        });
    },
    data() {
        const visible = this.visible.split(",");
        const required = this.required.split(",");
        const modifiedHeaders = this.headers.map(header => {
            if (visible.includes(header.value)) {
                return { ...header, visible: true };
            }
            if (required.includes(header.value)) {
                return { ...header, required: true };
            }
            return header;
        });
        const activeHeaders = Vue.ref(modifiedHeaders.filter(
            header => header.required
        ));
        return {
            itemsSelected: Vue.ref([]),
            modifiedHeaders,
            activeHeaders,
            value: '',
            filterOptions: [],
            searchText: '',
            activeItems: this.items,
            
        }

    },
    props: {
        type: {
            type: String,
            required: true
        },
        select: String,
        query: {
            type: Object || String,
            default: {}
        },
        watchDebounce: {
            type: Number,
            default: 500
        },
        headers: {
            type: Array,
            required: true
        },
        required: {
            type: String,
            default: ''
        },
        labelColumn: {
            type: String,
            default: 'nome'
        },
        visible: {
            type: String,
            default: ''
        },
        statusClasses: {
            type: Object,
            default: () => ({
                '-10': 'row--trash',
                '-2': 'row--archived',
                '-9': 'row--disabled',
                0: 'row--draft',
                1: 'row--enabled row--sent',
                2: 'row--invalid',
                3: 'row--notapproved',
                8: 'row--waitlist',
                10: 'row--approved',
            })
        },
    },

    computed: {
        activeColumns() {
            return this.activeHeaders.map(header => (header.text));
        },

        selectedColumns() {
            return this.activeHeaders.reduce((columns, header) => {
                columns.push(header.text);
                this.addInColumns(header.text)
                return columns;
            }, []);
        },

        optionalHeaders() {
            return this.modifiedHeaders.reduce((columns, header) => {
                if (!header.required) {
                    columns.push(header.text);
                }
                return columns;

            }, []);
        },
    },

    methods: {
        parseSlug(header) {
            if(header.slug){
                return header.slug
            }

            return header.value
        },
        
        getEntityData(obj, value) {
            let val = eval(`obj.${value}`);
            return val;
        },

        search(searchText, entities) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.query['@keyword'] = searchText
                entities.refresh();
            }, 1500);
        },

        removeFromColumns(tag) {
            if (this.activeColumns.includes(tag)) {
                const headerToRemove = this.activeHeaders.find(header => header.text === tag);

                if (headerToRemove && headerToRemove.required) {
                    this.messages.error(this.text('item obrigatório') + ' ' + headerToRemove.text);
                } else {
                    this.activeHeaders = this.activeHeaders.filter(header => header.text !== tag);
                }
            }
        },

        addInColumns(tag) {
            if (!this.activeColumns.includes(tag)) {
                this.activeHeaders.push(this.modifiedHeaders.find(header => header.text == tag));
            }
        },

        isActive(column) {
            return this.activeColumns.includes(column.text);
        },

        toggleColumn(column) {
            if (this.isActive(column)) {
                this.activeHeaders = this.activeHeaders.filter(header => header.text != column.text)
            } else {
                this.activeHeaders.push(column)
            }
        },
    },
});
