
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.48.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\index.svelte generated by Svelte v3.48.0 */

    const file$4 = "src\\index.svelte";

    function create_fragment$4(ctx) {
    	let title;
    	let t1;
    	let link;
    	let t2;
    	let div3;
    	let div2;
    	let div1;
    	let div0;
    	let t4;
    	let nav;
    	let a0;
    	let t6;
    	let a1;
    	let t8;
    	let a2;
    	let t10;
    	let a3;
    	let t12;
    	let div6;
    	let div5;
    	let div4;
    	let h1;
    	let t14;
    	let h2;

    	const block = {
    		c: function create() {
    			title = element("title");
    			title.textContent = "Leila Khaertdinova: Homepage";
    			t1 = space();
    			link = element("link");
    			t2 = space();
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "Leila Khaertdinova";
    			t4 = space();
    			nav = element("nav");
    			a0 = element("a");
    			a0.textContent = "Home";
    			t6 = space();
    			a1 = element("a");
    			a1.textContent = "About";
    			t8 = space();
    			a2 = element("a");
    			a2.textContent = "Dogs";
    			t10 = space();
    			a3 = element("a");
    			a3.textContent = "Contact";
    			t12 = space();
    			div6 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Hello everyone, I'm Leila";
    			t14 = space();
    			h2 = element("h2");
    			h2.textContent = "Welcome to my website!";
    			attr_dev(title, "class", "svelte-1q3fr9h");
    			add_location(title, file$4, 0, 0, 0);
    			attr_dev(link, "href", "https://fonts.googleapis.com/css2?family=Tiro+Tamil:ital@1&display=swap");
    			attr_dev(link, "rel", "stylesheet");
    			attr_dev(link, "class", "svelte-1q3fr9h");
    			add_location(link, file$4, 2, 0, 47);
    			attr_dev(div0, "class", "name svelte-1q3fr9h");
    			add_location(div0, file$4, 7, 16, 261);
    			attr_dev(a0, "class", "nav_links svelte-1q3fr9h");
    			add_location(a0, file$4, 10, 20, 451);
    			attr_dev(a1, "class", "nav_links svelte-1q3fr9h");
    			add_location(a1, file$4, 12, 20, 569);
    			attr_dev(a2, "class", "nav_links svelte-1q3fr9h");
    			add_location(a2, file$4, 14, 20, 688);
    			attr_dev(a3, "class", "nav_links svelte-1q3fr9h");
    			add_location(a3, file$4, 16, 20, 806);
    			attr_dev(nav, "class", "nav svelte-1q3fr9h");
    			add_location(nav, file$4, 8, 16, 321);
    			attr_dev(div1, "class", "header_in svelte-1q3fr9h");
    			add_location(div1, file$4, 6, 12, 220);
    			attr_dev(div2, "class", "container svelte-1q3fr9h");
    			add_location(div2, file$4, 5, 8, 183);
    			attr_dev(div3, "class", "header svelte-1q3fr9h");
    			add_location(div3, file$4, 4, 0, 153);
    			attr_dev(h1, "class", "hello svelte-1q3fr9h");
    			add_location(h1, file$4, 25, 12, 992);
    			attr_dev(h2, "class", "welcome svelte-1q3fr9h");
    			add_location(h2, file$4, 26, 12, 1054);
    			attr_dev(div4, "class", "intro_in svelte-1q3fr9h");
    			add_location(div4, file$4, 24, 8, 956);
    			attr_dev(div5, "class", "container svelte-1q3fr9h");
    			add_location(div5, file$4, 23, 4, 923);
    			attr_dev(div6, "class", "intro svelte-1q3fr9h");
    			add_location(div6, file$4, 22, 0, 898);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, link, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div1, t4);
    			append_dev(div1, nav);
    			append_dev(nav, a0);
    			append_dev(nav, t6);
    			append_dev(nav, a1);
    			append_dev(nav, t8);
    			append_dev(nav, a2);
    			append_dev(nav, t10);
    			append_dev(nav, a3);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, h1);
    			append_dev(div4, t14);
    			append_dev(div4, h2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(link);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(div6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Src', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Src> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Src extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Src",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\about.svelte generated by Svelte v3.48.0 */

    const file$3 = "src\\about.svelte";

    function create_fragment$3(ctx) {
    	let title;
    	let t1;
    	let link;
    	let t2;
    	let div3;
    	let div2;
    	let div1;
    	let div0;
    	let t4;
    	let nav;
    	let a0;
    	let t6;
    	let a1;
    	let t8;
    	let a2;
    	let t10;
    	let a3;
    	let t12;
    	let div7;
    	let div6;
    	let div4;
    	let img;
    	let img_src_value;
    	let t13;
    	let div5;
    	let p0;
    	let t15;
    	let p1;
    	let t17;
    	let ul;
    	let li0;
    	let t19;
    	let li1;
    	let t21;
    	let li2;
    	let t23;
    	let li3;
    	let t25;
    	let p2;

    	const block = {
    		c: function create() {
    			title = element("title");
    			title.textContent = "Leila Khaertdinova: About me";
    			t1 = space();
    			link = element("link");
    			t2 = space();
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "Leila Khaertdinova";
    			t4 = space();
    			nav = element("nav");
    			a0 = element("a");
    			a0.textContent = "Home";
    			t6 = space();
    			a1 = element("a");
    			a1.textContent = "About";
    			t8 = space();
    			a2 = element("a");
    			a2.textContent = "Dogs";
    			t10 = space();
    			a3 = element("a");
    			a3.textContent = "Contact";
    			t12 = space();
    			div7 = element("div");
    			div6 = element("div");
    			div4 = element("div");
    			img = element("img");
    			t13 = space();
    			div5 = element("div");
    			p0 = element("p");
    			p0.textContent = "I am bachelor at Innopolis Univesity. I am 18 years old. I was born in Kazan, Tatarstan.";
    			t15 = space();
    			p1 = element("p");
    			p1.textContent = "Some interesting facts about me:";
    			t17 = space();
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "I am big fan of Netflix series and Haribo gummies";
    			t19 = space();
    			li1 = element("li");
    			li1.textContent = "I speak Tatar language";
    			t21 = space();
    			li2 = element("li");
    			li2.textContent = "Recently I cooked borcht myself";
    			t23 = space();
    			li3 = element("li");
    			li3.textContent = "I like dogs, they are cute";
    			t25 = space();
    			p2 = element("p");
    			p2.textContent = "P.S. Click on DOGS";
    			attr_dev(title, "class", "svelte-1gkrln3");
    			add_location(title, file$3, 0, 0, 0);
    			attr_dev(link, "href", "https://fonts.googleapis.com/css2?family=Tiro+Tamil:ital@1&display=swap");
    			attr_dev(link, "rel", "stylesheet");
    			attr_dev(link, "class", "svelte-1gkrln3");
    			add_location(link, file$3, 2, 0, 47);
    			attr_dev(div0, "class", "name svelte-1gkrln3");
    			add_location(div0, file$3, 7, 12, 249);
    			attr_dev(a0, "class", "nav_links svelte-1gkrln3");
    			add_location(a0, file$3, 10, 16, 403);
    			attr_dev(a1, "class", "nav_links svelte-1gkrln3");
    			add_location(a1, file$3, 12, 16, 513);
    			attr_dev(a2, "class", "nav_links svelte-1gkrln3");
    			add_location(a2, file$3, 14, 16, 624);
    			attr_dev(a3, "class", "nav_links svelte-1gkrln3");
    			add_location(a3, file$3, 16, 16, 734);
    			attr_dev(nav, "class", "nav svelte-1gkrln3");
    			add_location(nav, file$3, 8, 12, 305);
    			attr_dev(div1, "class", "header_in svelte-1gkrln3");
    			add_location(div1, file$3, 6, 8, 212);
    			attr_dev(div2, "class", "container svelte-1gkrln3");
    			add_location(div2, file$3, 5, 4, 179);
    			attr_dev(div3, "class", "header svelte-1gkrln3");
    			add_location(div3, file$3, 4, 0, 153);
    			if (!src_url_equal(img.src, img_src_value = "https://cdn.icon-icons.com/icons2/2630/PNG/512/diversity_avatar_girl_woman_black_hair_people_icon_159085.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-1gkrln3");
    			add_location(img, file$3, 26, 12, 979);
    			attr_dev(div4, "class", "me svelte-1gkrln3");
    			add_location(div4, file$3, 24, 8, 890);
    			attr_dev(p0, "class", "svelte-1gkrln3");
    			add_location(p0, file$3, 29, 12, 1166);
    			attr_dev(p1, "class", "svelte-1gkrln3");
    			add_location(p1, file$3, 30, 12, 1275);
    			attr_dev(li0, "class", "svelte-1gkrln3");
    			add_location(li0, file$3, 32, 16, 1350);
    			attr_dev(li1, "class", "svelte-1gkrln3");
    			add_location(li1, file$3, 33, 16, 1426);
    			attr_dev(li2, "class", "svelte-1gkrln3");
    			add_location(li2, file$3, 34, 16, 1475);
    			attr_dev(li3, "class", "svelte-1gkrln3");
    			add_location(li3, file$3, 35, 16, 1533);
    			attr_dev(ul, "class", "svelte-1gkrln3");
    			add_location(ul, file$3, 31, 12, 1328);
    			attr_dev(p2, "class", "svelte-1gkrln3");
    			add_location(p2, file$3, 37, 12, 1601);
    			attr_dev(div5, "class", "personal_info svelte-1gkrln3");
    			add_location(div5, file$3, 28, 8, 1125);
    			attr_dev(div6, "class", "container_about svelte-1gkrln3");
    			add_location(div6, file$3, 23, 4, 851);
    			attr_dev(div7, "class", "intro svelte-1gkrln3");
    			add_location(div7, file$3, 22, 0, 826);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, link, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div1, t4);
    			append_dev(div1, nav);
    			append_dev(nav, a0);
    			append_dev(nav, t6);
    			append_dev(nav, a1);
    			append_dev(nav, t8);
    			append_dev(nav, a2);
    			append_dev(nav, t10);
    			append_dev(nav, a3);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div6);
    			append_dev(div6, div4);
    			append_dev(div4, img);
    			append_dev(div6, t13);
    			append_dev(div6, div5);
    			append_dev(div5, p0);
    			append_dev(div5, t15);
    			append_dev(div5, p1);
    			append_dev(div5, t17);
    			append_dev(div5, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t19);
    			append_dev(ul, li1);
    			append_dev(ul, t21);
    			append_dev(ul, li2);
    			append_dev(ul, t23);
    			append_dev(ul, li3);
    			append_dev(div5, t25);
    			append_dev(div5, p2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(link);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(div7);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\contactinfo.svelte generated by Svelte v3.48.0 */

    const file$2 = "src\\contactinfo.svelte";

    function create_fragment$2(ctx) {
    	let title;
    	let t1;
    	let link0;
    	let t2;
    	let link1;
    	let t3;
    	let div3;
    	let div2;
    	let div1;
    	let div0;
    	let t5;
    	let nav;
    	let a0;
    	let t7;
    	let a1;
    	let t9;
    	let a2;
    	let t11;
    	let a3;
    	let t13;
    	let div7;
    	let div6;
    	let div5;
    	let h1;
    	let t15;
    	let br0;
    	let t16;
    	let br1;
    	let t17;
    	let div4;
    	let a4;
    	let t18;
    	let a5;
    	let t19;
    	let a6;

    	const block = {
    		c: function create() {
    			title = element("title");
    			title.textContent = "Leila Khaertdinova: Contacts";
    			t1 = space();
    			link0 = element("link");
    			t2 = space();
    			link1 = element("link");
    			t3 = space();
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "Leila Khaertdinova";
    			t5 = space();
    			nav = element("nav");
    			a0 = element("a");
    			a0.textContent = "Home";
    			t7 = space();
    			a1 = element("a");
    			a1.textContent = "About";
    			t9 = space();
    			a2 = element("a");
    			a2.textContent = "Dogs";
    			t11 = space();
    			a3 = element("a");
    			a3.textContent = "Contact";
    			t13 = space();
    			div7 = element("div");
    			div6 = element("div");
    			div5 = element("div");
    			h1 = element("h1");
    			h1.textContent = "You can contact me via:";
    			t15 = space();
    			br0 = element("br");
    			t16 = space();
    			br1 = element("br");
    			t17 = space();
    			div4 = element("div");
    			a4 = element("a");
    			t18 = space();
    			a5 = element("a");
    			t19 = space();
    			a6 = element("a");
    			attr_dev(title, "class", "svelte-16z5spc");
    			add_location(title, file$2, 0, 0, 0);
    			attr_dev(link0, "href", "https://fonts.googleapis.com/css2?family=Tiro+Tamil:ital@1&display=swap");
    			attr_dev(link0, "rel", "stylesheet");
    			attr_dev(link0, "class", "svelte-16z5spc");
    			add_location(link0, file$2, 2, 0, 47);
    			attr_dev(link1, "rel", "stylesheet");
    			attr_dev(link1, "href", "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");
    			attr_dev(link1, "class", "svelte-16z5spc");
    			add_location(link1, file$2, 3, 0, 151);
    			attr_dev(div0, "class", "name svelte-16z5spc");
    			add_location(div0, file$2, 8, 16, 376);
    			attr_dev(a0, "class", "nav_links svelte-16z5spc");
    			add_location(a0, file$2, 11, 20, 542);
    			attr_dev(a1, "class", "nav_links svelte-16z5spc");
    			add_location(a1, file$2, 13, 20, 660);
    			attr_dev(a2, "class", "nav_links svelte-16z5spc");
    			add_location(a2, file$2, 15, 20, 779);
    			attr_dev(a3, "class", "nav_links svelte-16z5spc");
    			add_location(a3, file$2, 17, 20, 897);
    			attr_dev(nav, "class", "nav svelte-16z5spc");
    			add_location(nav, file$2, 9, 16, 436);
    			attr_dev(div1, "class", "header_in svelte-16z5spc");
    			add_location(div1, file$2, 7, 12, 335);
    			attr_dev(div2, "class", "container svelte-16z5spc");
    			add_location(div2, file$2, 6, 8, 298);
    			attr_dev(div3, "class", "header svelte-16z5spc");
    			add_location(div3, file$2, 5, 0, 268);
    			attr_dev(h1, "class", "contact svelte-16z5spc");
    			add_location(h1, file$2, 26, 12, 1083);
    			attr_dev(br0, "class", "svelte-16z5spc");
    			add_location(br0, file$2, 27, 12, 1145);
    			attr_dev(br1, "class", "svelte-16z5spc");
    			add_location(br1, file$2, 28, 12, 1163);
    			attr_dev(a4, "class", "fa fa-vk svelte-16z5spc");
    			attr_dev(a4, "href", "https://vk.com/leykhaertdinova");
    			add_location(a4, file$2, 30, 16, 1225);
    			attr_dev(a5, "class", "fa fa-telegram svelte-16z5spc");
    			attr_dev(a5, "href", "https://t.me/leila1kh");
    			add_location(a5, file$2, 31, 16, 1306);
    			attr_dev(a6, "class", "fa fa-instagram svelte-16z5spc");
    			attr_dev(a6, "href", "https://instagram.com/leiluk1?igshid=YmMyMTA2M2Y=");
    			add_location(a6, file$2, 32, 16, 1384);
    			attr_dev(div4, "class", "contact-icon svelte-16z5spc");
    			add_location(div4, file$2, 29, 12, 1181);
    			attr_dev(div5, "class", "intro_in svelte-16z5spc");
    			add_location(div5, file$2, 25, 8, 1047);
    			attr_dev(div6, "class", "container svelte-16z5spc");
    			add_location(div6, file$2, 24, 4, 1014);
    			attr_dev(div7, "class", "intro svelte-16z5spc");
    			add_location(div7, file$2, 23, 0, 989);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, link0, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, link1, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div1, t5);
    			append_dev(div1, nav);
    			append_dev(nav, a0);
    			append_dev(nav, t7);
    			append_dev(nav, a1);
    			append_dev(nav, t9);
    			append_dev(nav, a2);
    			append_dev(nav, t11);
    			append_dev(nav, a3);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div5, h1);
    			append_dev(div5, t15);
    			append_dev(div5, br0);
    			append_dev(div5, t16);
    			append_dev(div5, br1);
    			append_dev(div5, t17);
    			append_dev(div5, div4);
    			append_dev(div4, a4);
    			append_dev(div4, t18);
    			append_dev(div4, a5);
    			append_dev(div4, t19);
    			append_dev(div4, a6);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(link0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(link1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(div7);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Contactinfo', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Contactinfo> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Contactinfo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contactinfo",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\dogs.svelte generated by Svelte v3.48.0 */

    const file$1 = "src\\dogs.svelte";

    function create_fragment$1(ctx) {
    	let div3;
    	let div2;
    	let div1;
    	let div0;
    	let t1;
    	let nav;
    	let a0;
    	let t3;
    	let a1;
    	let t5;
    	let a2;
    	let t7;
    	let a3;
    	let t9;
    	let div7;
    	let div6;
    	let div5;
    	let div4;
    	let t10;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "Leila Khaertdinova";
    			t1 = space();
    			nav = element("nav");
    			a0 = element("a");
    			a0.textContent = "Home";
    			t3 = space();
    			a1 = element("a");
    			a1.textContent = "About";
    			t5 = space();
    			a2 = element("a");
    			a2.textContent = "Dogs";
    			t7 = space();
    			a3 = element("a");
    			a3.textContent = "Contact";
    			t9 = space();
    			div7 = element("div");
    			div6 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			t10 = space();
    			button = element("button");
    			button.textContent = "Click to see dog";
    			attr_dev(div0, "class", "name svelte-17ih9n7");
    			add_location(div0, file$1, 19, 16, 538);
    			attr_dev(a0, "class", "nav_links svelte-17ih9n7");
    			add_location(a0, file$1, 22, 20, 704);
    			attr_dev(a1, "class", "nav_links svelte-17ih9n7");
    			add_location(a1, file$1, 24, 20, 822);
    			attr_dev(a2, "class", "nav_links svelte-17ih9n7");
    			add_location(a2, file$1, 26, 20, 941);
    			attr_dev(a3, "class", "nav_links svelte-17ih9n7");
    			add_location(a3, file$1, 28, 20, 1059);
    			attr_dev(nav, "class", "nav svelte-17ih9n7");
    			add_location(nav, file$1, 20, 16, 598);
    			attr_dev(div1, "class", "header_in svelte-17ih9n7");
    			add_location(div1, file$1, 18, 12, 497);
    			attr_dev(div2, "class", "container svelte-17ih9n7");
    			add_location(div2, file$1, 17, 8, 460);
    			attr_dev(div3, "class", "header svelte-17ih9n7");
    			add_location(div3, file$1, 16, 0, 430);
    			attr_dev(div4, "id", "dog");
    			attr_dev(div4, "class", "svelte-17ih9n7");
    			add_location(div4, file$1, 36, 12, 1248);
    			attr_dev(div5, "class", "dog_image svelte-17ih9n7");
    			add_location(div5, file$1, 35, 8, 1211);
    			attr_dev(button, "class", "button svelte-17ih9n7");
    			attr_dev(button, "id", "btn");
    			add_location(button, file$1, 38, 8, 1294);
    			attr_dev(div6, "class", "container_dog svelte-17ih9n7");
    			add_location(div6, file$1, 34, 4, 1174);
    			attr_dev(div7, "class", "intro svelte-17ih9n7");
    			add_location(div7, file$1, 33, 0, 1149);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, nav);
    			append_dev(nav, a0);
    			append_dev(nav, t3);
    			append_dev(nav, a1);
    			append_dev(nav, t5);
    			append_dev(nav, a2);
    			append_dev(nav, t7);
    			append_dev(nav, a3);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div6, t10);
    			append_dev(div6, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(div7);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dogs', slots, []);
    	const dog = document.getElementById('dog');
    	const btn = document.getElementById('btn');

    	function getRandomDog() {
    		fetch('https://random.dog/woof.json').then(res => res.json()).then(data => {
    			if (data.url.includes('.mp4')) {
    				getRandomDog();
    			} else {
    				dog.innerHTML = `<img src="${data.url}"/>`;
    			}
    		});
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dogs> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => getRandomDog;
    	$$self.$capture_state = () => ({ dog, btn, getRandomDog });
    	return [getRandomDog, click_handler];
    }

    class Dogs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dogs",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.48.0 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let home;
    	let t0;
    	let about;
    	let t1;
    	let dogs;
    	let t2;
    	let contact;
    	let current;
    	home = new Src({ $$inline: true });
    	about = new About({ $$inline: true });
    	dogs = new Dogs({ $$inline: true });
    	contact = new Contactinfo({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(home.$$.fragment);
    			t0 = space();
    			create_component(about.$$.fragment);
    			t1 = space();
    			create_component(dogs.$$.fragment);
    			t2 = space();
    			create_component(contact.$$.fragment);
    			add_location(main, file, 5, 0, 181);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(home, main, null);
    			append_dev(main, t0);
    			mount_component(about, main, null);
    			append_dev(main, t1);
    			mount_component(dogs, main, null);
    			append_dev(main, t2);
    			mount_component(contact, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(home.$$.fragment, local);
    			transition_in(about.$$.fragment, local);
    			transition_in(dogs.$$.fragment, local);
    			transition_in(contact.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(home.$$.fragment, local);
    			transition_out(about.$$.fragment, local);
    			transition_out(dogs.$$.fragment, local);
    			transition_out(contact.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(home);
    			destroy_component(about);
    			destroy_component(dogs);
    			destroy_component(contact);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Home: Src, About, Contact: Contactinfo, Dogs });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
        props: {
            name: 'world'
        }
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
