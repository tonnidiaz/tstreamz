import { Accordion, Button, Clipboard, Datepicker, Label, TextInput } from "flowbite-react";
const Components = () => {
    return (
        <div className="p-4 flex flex-col gap-4 m-auto" style={{width: 500}}>
            <Button>Flowbite Button</Button>
            {/* <TuButton variant="default">Tu button</TuButton> */}
            <Accordion>
                <Accordion.Panel>
                    <Accordion.Title>What is Flowbite?</Accordion.Title>
                    <Accordion.Content>
                        <p className="mb-2 text-gray-500 dark:text-gray-400">
                            Flowbite is an open-source library of interactive
                            components built on top of Tailwind CSS including
                            buttons, dropdowns, modals, navbars, and more.
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                            Check out this guide to learn how to&nbsp;
                            <a
                                href="https://flowbite.com/docs/getting-started/introduction/"
                                className="text-cyan-600 hover:underline dark:text-cyan-500"
                            >
                                get started&nbsp;
                            </a>
                            and start developing websites even faster with
                            components on top of Tailwind CSS.
                        </p>
                    </Accordion.Content>
                </Accordion.Panel>
            </Accordion>
            <div className="grid w-full max-w-64">
                <div className="relative">
                    <label htmlFor="npm-install" className="sr-only">
                        Label
                    </label>
                    <input
                        id="npm-install"
                        type="text"
                        className="col-span-6 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        value="npm install flowbite-react"
                        disabled
                        readOnly
                    />
                    <Clipboard.WithIcon valueToCopy="npm install flowbite-react --template=tu" />
                </div>
            </div>
            <Datepicker
                minDate={new Date(2023, 0, 1)}
                maxDate={new Date(2023, 3, 30)}
            />
            <div>
        <div className="mb-2 block">
          <Label htmlFor="email1" value="Your email" />
        </div>
        <TextInput id="email1" type="email" placeholder="name@flowbite.com" required />
      </div>
        </div>
    );
};

export default Components;
