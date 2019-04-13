import {Dropdown} from '../../components';
import {Item} from '../../components/Dropdown';

export default function DropdownTest() {
    return (
        <div>
            <Dropdown label="Select an item...">
                <Item>Item #1</Item>
                <Item>Item #2</Item>
                <Item>Item #3</Item>
                <Item>Item #4</Item>
                <Item>Loooooooooooooooooooooooooooooooong list item</Item>
                <Item>Item #6</Item>
                <Item>Item #7</Item>
                <Item>Item #8</Item>
                <Item>Item #9</Item>
                <Item>Item #10</Item>
                <Item>Item #11</Item>
                <Item>Item #12</Item>
                <Item>Item #13</Item>
            </Dropdown>
            <Dropdown mini label="Mini dropdown">
                <Item>Item #1</Item>
                <Item>Item #2</Item>
                <Item>Item #3</Item>
                <Item>Item #4</Item>
                <Item>Loooooooooooooooooooooooooooooooong list item</Item>
                <Item>Item #6</Item>
                <Item>Item #7</Item>
                <Item>Item #8</Item>
                <Item>Item #9</Item>
                <Item>Item #10</Item>
                <Item>Item #11</Item>
                <Item>Item #12</Item>
                <Item>Item #13</Item>
            </Dropdown>
        </div>
    );
}
