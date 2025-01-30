import { LabelHTMLAttributes, useEffect, useRef } from "react";
import { ISelectItem, TState } from "../lib/interfaces";
import UFormGroup from "./UFormGroup";
import { useTuState } from "../lib/tu";

interface IProps extends LabelHTMLAttributes<{}> {
    innerHint?: string;
    options?: ISelectItem[];
    placeholder?: string;
    value: TState<any>;
    disabled?: boolean;
    showLabel?: boolean;
    required?: boolean;
    searchable?: boolean;
    selectClass?: string;
}

export default function TuSelect({
    innerHint,
    options,
    value = useTuState(),
    placeholder,
    disabled,
    required,
    className,
    showLabel,
    selectClass,
    ...props
}: IProps) {
    let formRef = useRef<HTMLDivElement>(null);
    let dropdownRef = useRef<HTMLSelectElement>(null),
        created = useTuState(false);
    // Check if Dropdowns are Exist
    // Loop Dropdowns and Create Custom Dropdown for each Select Element
    let selectedItem = useTuState<HTMLDivElement>();
    let _options = useTuState<ISelectItem[]>();

    // $effect(()=>{
    //     const val = value
    //     // console.log({val});
    // })
    // Create Custom Dropdown
    const createCustomDropdown = async (dropdown: HTMLSelectElement) => {
        //console.log("CREATE", _options.value?.length);
        // Get All Select Options
        // And Convert them from NodeList to Array
        // console.log("Creating");

        const opts = _options.value || [];
        const optionsArr: ISelectItem[] = [...opts]; //Array.prototype.slice.call(options);

        const _par = dropdown.parentElement;
        const dd = _par?.querySelector("div.tu-dropdown");
        if (dd) {
            _par?.removeChild(dd);
        }
        // Create Custom Dropdown Element and Add Class Dropdown
        const customDropdown = document.createElement("div");
        customDropdown.classList.add("tu-dropdown");

        if (disabled) {
            customDropdown.classList.add("disabled");
        }
        dropdown.insertAdjacentElement("afterend", customDropdown);

        const selectedOpt =
            optionsArr.find(
                (el) =>
                    (typeof el.value == "string"
                        ? el.value
                        : JSON.stringify(el.value)) ==
                    (typeof value == "string" ? value : JSON.stringify(value))
            ) ?? optionsArr[0];
        // Create Element for Selected Option
        const selected = document.createElement("div");
        selected.classList.add("tu-dropdown-select");
        setContent(selected, selectedOpt);
        customDropdown.appendChild(selected);

        // Create Element for Dropdown Menu
        // Add Class and Append it to Custom Dropdown
        const menu = document.createElement("div");
        menu.classList.add("tu-dropdown-menu");
        customDropdown.appendChild(menu);
        selected.addEventListener("click", toggleDropdown.bind(menu));

        // Create Search Input Element
        const search = document.createElement("input");
        search.placeholder = "Search...";
        search.type = "text";
        search.classList.add("tu-dropdown-menu-search");
        menu.appendChild(search);

        // Create Wrapper Element for Menu Items
        // Add Class and Append to Menu Element
        const menuInnerWrapper = document.createElement("div");
        menuInnerWrapper.classList.add("tu-dropdown-menu-inner");
        menu.appendChild(menuInnerWrapper);

        // Loop All Options and Create Custom Option for Each Option
        // And Append it to Inner Wrapper Element

        optionsArr.forEach((option, i) => {
            const item = document.createElement("div");
            item.classList.add("tu-dropdown-menu-item");
            item.dataset.index = i.toString();

            const el = option;
            if (
                (typeof el.value == "string"
                    ? el.value
                    : JSON.stringify(el.value)) ==
                (typeof value == "string" ? value : JSON.stringify(value))
            ) {
                item.classList.add("is-select");
            }
            if (i == 0 || option.disabled) {
                item.classList.add(
                    i == 0 ? "select-placeholder" : "item-disabled"
                );
            }
            item.dataset.value = option.value;
            setContent(item, option);
            menuInnerWrapper.appendChild(item);

            item.addEventListener(
                "click",
                setSelected.bind(item, selected, dropdown, menu)
            );
        });

        // Add Selected Class to First Custom Select Option
        menuInnerWrapper.querySelector("div")?.classList.add("selected");
        //menuInnerWrapper.addEventListener("scroll", onItemScroll)

        // Add Input Event to Search Input Element to Filter Items
        // Add Click Event to Element to Close Custom Dropdown if Clicked Outside
        // Hide the Original Dropdown(Select)
        search.addEventListener(
            "input",
            filterItems.bind(search, optionsArr, menu)
        );
        document.addEventListener(
            "click",
            closeIfClickedOutside.bind(customDropdown, menu)
        );
        dropdown.style.display = "none";
        if (_options.value?.length) {
            created.value = true;
        }
    };

    const onItemScroll = (e) => {
        const parent = e.currentTarget;
        const parentRect = parent.getBoundingClientRect();
        const options = parent.querySelectorAll(".tu-dropdown-menu-item");
        options.forEach((el) => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top >= 0 && rect.bottom <= parentRect.height;
            if (isVisible) console.log({ el: el.textContent, isVisible });

            if (isVisible && !el.classList.contains("v-hidden"))
                el.classList.add("v-hidden");
            else if (!isVisible) el.classList.remove("v-hidden");
        });
    };
    const setContent = (el: any, opt: ISelectItem, extrClass?: string) => {
        let html = `<div className="${opt.class ?? "opt"} ${extrClass}">${opt.html ?? opt.label}</div>`;
        el.innerHTML = html;
    };

    let filteredOptions = $state<ISelectItem[]>();
    const setFilteredOpts = (v: typeof filteredOptions) =>
        (filteredOptions = v);

    // Toggle for Display and Hide Dropdown
    function toggleDropdown(this: any) {
        if ((this as any).offsetParent) {
            (this as any).style.display = "none";
        } else {
            (this as any).style.display = "block";
            //(this as any).querySelector("input").focus();
            const selected: HTMLDivElement | null = this.querySelector(
                ".tu-dropdown-menu-item.is-select"
            );
            if (selected) {
                selected.scrollIntoView();
            }
        }
    }

    // Set Selected Option
    function setSelected(this, selected, dropdown: HTMLSelectElement, menu) {
        // Get Value and Label from Clicked Custom Option
        selectedItem = this;
        let _value = (this as any).dataset.value;
        _value = _options.value?.find(
            (el) => el.value?.toString() == _value
        )?.value;
        value.value = _value;

        const label = (this as any).innerHTML;

        // Change the Text on Selected Element
        // Change the Value on Select Field
        selected.innerHTML = label;
        dropdown.value = _value;
        menu.style.display = "none";
        menu.querySelector("input").value = "";

        const menutItems = menu.querySelectorAll(".tu-dropdown-menu-item");
        menutItems.forEach((el) => {
            el.classList.remove("is-select");
        });
        selectedItem.value?.classList.add("is-select");
    }

    const parseStr = (val?: string) =>
        !val
            ? undefined
            : val
                  .toLowerCase()
                  .replaceAll("/", "")
                  .replaceAll(",", "")
                  .replaceAll(" ", "")
                  .trim();
    // Filter the Items
    function filterItems(this, itemsArr: ISelectItem[], menu) {
        // Get All Custom Select Options
        // Get Value of Search Input
        // Get Filtered Items
        // Get the Indexes of Filtered Items
        const customOptions = menu.querySelectorAll(
            ".tu-dropdown-menu-inner div"
        );
        const value = (this as any).value.toLowerCase();
        //console.log({ value });
        const filteredItems = itemsArr.filter((item) =>
            parseStr(item.value?.toString())?.includes(parseStr(value)!)
        );
        const indexesArr = filteredItems.map((item) =>
            itemsArr.findIndex(
                (el) => el.value?.toString() == item.value?.toString()
            )
        );
        //console.log(indexesArr);

        // Check if Option is not Inside Indexes Array
        // And Hide it and if it is Inside Indexes Array and it is Hidden Show it
        for (let option of itemsArr) {
            const ind = itemsArr.findIndex(
                (el) => el.value?.toString() == option.value?.toString()
            );

            //customOptions[ind].style.display = "none";
            const opt = [...customOptions].find(
                (el) => el.dataset.index == `${ind}`
            );
            if (
                !indexesArr.includes(
                    itemsArr.findIndex(
                        (el) => el.value?.toString() == option.value
                    )
                ) &&
                value?.length &&
                ind != 0
            ) {
                //console.log(option.value, ind, opt);
                if (opt) opt.style.display = "none";
            } else {
                if (opt.offsetParent === null) {
                    opt.style.display = "block";
                }
            }
        }
    }

    // Close Dropdown if Clicked Outside Dropdown Element
    function closeIfClickedOutside(this, menu, e) {
        if (
            e.target.closest(".tu-dropdown") === null &&
            e.target !== this &&
            menu.offsetParent
        ) {
            menu.style.display = "none";
        }
    }

    /* -------------Begin Effects ---------------- */
    useEffect(() => {
        const form = formRef.current;
        if (form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
            });
        }
    }, [formRef.current]);

    useEffect(() => {
        const opts = options;
        const _disabled = disabled;
        const val = value;
        const dd = dropdownRef.current;

        const oldOpts = _options.value;
        const newOpts = [
            {
                label: placeholder ?? "Select",
                value: undefined,
            },
            ...opts,
        ];
        if (opts) {
            _options.value = newOpts;
        }
        if (
            !created.value ||
            !opts ||
            newOpts != oldOpts
            // || val != ov
        ) {
            if (dd) {
                //console.log("CREATE DD", {val});
                //console.log(opts)
                createCustomDropdown(dd);
            }
        }
    }, [value.value, options, disabled, dropdownRef.current]);

    return (
        <UFormGroup label={showLabel ? placeholder : undefined} {...props}>
            <div className="mb-2 hidden">{JSON.stringify(options)}</div>
            <div className={"tu-select " + selectClass}>
                <section className="section wrapper wrapper-section">
                    <div className="container wrapper-column">
                        <div className="tu-select-form" ref={formRef}>
                            <div className="tu-select-form-group">
                                <span className="tu-select-form-arrow text-white-1">
                                    <i className="fi fi-br-angle-small-down"></i>
                                </span>
                                <select
                                    className="tu-dropdown hidden"
                                    ref={dropdownRef}
                                    value={value.value}
                                >
                                    <option disabled>{placeholder}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </UFormGroup>
    );
}
