import ButtonComponent from 'kitvue-public/src/components/Button/Button.vue'
import ModalComponent from 'kitvue-public/src/components/Modal/ModalComponent.vue'
import CustomModalComponent from 'kitvue-public/src/components/Modal/CustomModal.vue'
import ModalBottomSheetComponent from '@/components/shared/modal/ModalBottomSheet.vue'
import ListGroupUnit from 'kitvue-public/src/components/ListGroup/ListGroupOrdered.vue'
import DropdownComponent from 'kitvue-public/src/components/Dropdown/InputDropdown.vue'
import TeleportDropdown from '@/components/shared/dropdown/TeleportDropdown.vue'
import InputNominalEnd from 'kitvue-public/src/components/Input/InputNominalEnd.vue'
import InputNominalStart from 'kitvue-public/src/components/Input/InputNominalStart.vue'
import InputTextComponent from 'kitvue-public/src/components/Input/InputText.vue'
import InputNIKComponent from 'kitvue-public/src/components/Input/InputNIK.vue'
import InputDatePickerComponent from 'kitvue-public/src/components/Input/InputDatePicker.vue'
import InputSmallDateComponent from 'kitvue-public/src/components/Input/InputSmallDate.vue'
import Accordion from 'kitvue-public/src/components/Accordion/Accordion.vue'
import TextArea from 'kitvue-public/src/components/Input/InputTextArea.vue'
import Alert from 'kitvue-public/src/components/Alert/AlertVarian.vue'
import Stepper from 'kitvue-public/src/components/Stepper/Stepper.vue'
import AccordionItem from 'kitvue-public/src/components/Accordion/AccordionItem.vue'
import TableComponent from 'kitvue-public/src/components/Table/TableData.vue'
import LoadAnimate from 'kitvue-public/src/components/Modal/Load.vue'
import TablePaginationComponent from 'kitvue-public/src/components/Table/TablePagination.vue'
import DateRangePickerComponent from 'kitvue-public/src/components/Input/DateRangePicker.vue'
import DateRangePickerOptionComponent from 'kitvue-public/src/components/Input/DateRangePickerOption.vue'
import InputCamera from 'kitvue-public/src/components/Input/InputCamera.vue'
import InputRadio from 'kitvue-public/src/components/Radio/Radio.vue'
import BadgeComponent from 'kitvue-public/src/components/Badge/Badge.vue'
import CardContent from 'kitvue-public/src/components/Card/CardContent.vue'
import BreadcrumbComponent from 'kitvue-public/src/components/Breadcrumb/Breadcrumb.vue'
import NavBackNavigator from 'kitvue-public/src/components/Navbar/NavBackNavigator.vue'
import BerandaHeader from 'kitvue-public/src/components/Navbar/BerandaHeader.vue'
import LineChart from 'kitvue-public/src/components/Chart/LineChart.vue'
import TimePickerResponsive from 'kitvue-public/src/components/Input/TimePickerResponsive.vue'
import AddAmountCounter from 'kitvue-public/src/components/AddAmount/AddAmountCounter.vue'
import FilterCMSComponent from 'kitvue-public/src/components/Filter/FilterCMS.vue'
import CustomCheckboxComponent from 'kitvue-public/src/components/Checkbox/CustomCheckbox.vue'
import NewInputCameraComponent from 'kitvue-public/src/components/Input/NewInputCamera.vue'

// Re-exports conforming to Kitvue conventions (both Button and GButton syntax supported)
export const Button = ButtonComponent
export const GButton = ButtonComponent

export const Modal = ModalComponent
export const GModal = ModalComponent
export const CustomModal = CustomModalComponent
export const ModalBottomSheet = ModalBottomSheetComponent
export const GModalBottomSheet = ModalBottomSheetComponent

export const FilterCMS = FilterCMSComponent
export const GFilterCMS = FilterCMSComponent

export const Dropdown = DropdownComponent
export const GDropdown = DropdownComponent

export const InputText = InputTextComponent
export const GInputText = InputTextComponent

export const InputNIK = InputNIKComponent
export const GInputNIK = InputNIKComponent

export const InputDatePicker = InputDatePickerComponent
export const GInputDatePicker = InputDatePickerComponent

export const InputSmallDate = InputSmallDateComponent
export const GInputSmallDate = InputSmallDateComponent

export const DateRangePickerOption = DateRangePickerOptionComponent
export const GDateRangePickerOption = DateRangePickerOptionComponent

export const DateRangePicker = DateRangePickerComponent
export const GRangeDatePicker = DateRangePickerComponent

export const Table = TableComponent
export const GTable = TableComponent

export const TablePagination = TablePaginationComponent
export const GTablePagination = TablePaginationComponent

export const Breadcrumb = BreadcrumbComponent
export const GBreadcrumb = BreadcrumbComponent

export const Badge = BadgeComponent
export const GBadge = BadgeComponent

export const ListGroup = ListGroupUnit
export const GListGroup = ListGroupUnit

export const TeleportDropdownComponent = TeleportDropdown
export const GTeleportDropdown = TeleportDropdown

export const InputRupiah = InputNominalEnd
export const GInputRupiah = InputNominalEnd
export const GInputNominalEnd = InputNominalEnd
export const GInputNominalStart = InputNominalStart
export { InputNominalEnd, InputNominalStart }

export const AccordionGroup = Accordion
export const GAccordion = Accordion
export const AccordionItemComponent = AccordionItem
export const GAccordionItem = AccordionItem

export const TextAreaComponent = TextArea
export const GTextArea = TextArea

export const AlertComponent = Alert
export const GAlert = Alert

export const StepperComponent = Stepper
export const GStepper = Stepper

export const Loading = LoadAnimate
export const GLoading = LoadAnimate

export const InputCameraComponent = InputCamera
export const GInputCamera = InputCamera

export const Radio = InputRadio
export const GRadio = InputRadio
export const RadioComponent = InputRadio

export const Card = CardContent
export const GCardContent = CardContent

export const NavBack = NavBackNavigator
export const GNavBackNavigator = NavBackNavigator

export const BerandaHeaderComponent = BerandaHeader
export const GBerandaHeader = BerandaHeader

export const Chart = LineChart
export const GLineChart = LineChart

export const TimePicker = TimePickerResponsive
export const GTimePickerResponsive = TimePickerResponsive

export const Counter = AddAmountCounter
export const GAddAmountCounter = AddAmountCounter

export const CustomCheckbox = CustomCheckboxComponent
export const GCheckbox = CustomCheckboxComponent

export const NewInputCamera = NewInputCameraComponent
