import { ApiKeyField } from "../common/ApiKeyField"
import { DebouncedTextField } from "../common/DebouncedTextField"
import { useExtensionState } from "@/context/ExtensionStateContext"
import { useApiConfigurationHandlers } from "../utils/useApiConfigurationHandlers"
import { getModeSpecificFields } from "../utils/providerUtils"
import { ApiConfiguration } from "@shared/api"
import { Mode } from "@shared/storage/types"
/**
 * Props for the FireworksProvider component
 */
interface FireworksProviderProps {
	showModelOptions: boolean
	isPopup?: boolean
	currentMode: Mode
}

/**
 * The Fireworks provider configuration component
 */
export const FireworksProvider = ({ showModelOptions, isPopup, currentMode }: FireworksProviderProps) => {
	const { apiConfiguration } = useExtensionState()
	const { handleModeFieldChange, handleFieldChange } = useApiConfigurationHandlers()

	const { fireworksModelId } = getModeSpecificFields(apiConfiguration, currentMode)

	// Handler for number input fields with validation
	const handleNumberInputChange = (field: keyof ApiConfiguration, value: string) => {
		if (!value) {
			return
		}
		const num = parseInt(value, 10)
		if (isNaN(num)) {
			return
		}
		handleFieldChange(field, num)
	}

	return (
		<div>
			<ApiKeyField
				initialValue={apiConfiguration?.fireworksApiKey || ""}
				onChange={(value) => handleFieldChange("fireworksApiKey", value)}
				providerName="Fireworks"
				signupUrl="https://fireworks.ai/settings/users/api-keys"
			/>

			{showModelOptions && (
				<>
					<DebouncedTextField
						initialValue={fireworksModelId || ""}
						onChange={(value) =>
							handleModeFieldChange(
								{ plan: "planModeFireworksModelId", act: "actModeFireworksModelId" },
								value,
								currentMode,
							)
						}
						style={{ width: "100%" }}
						placeholder={"Enter Model ID..."}>
						<span style={{ fontWeight: 500 }}>Model ID</span>
					</DebouncedTextField>
					<p
						style={{
							fontSize: "12px",
							marginTop: 3,
							color: "var(--vscode-descriptionForeground)",
						}}>
						<span style={{ color: "var(--vscode-errorForeground)" }}>
							(<span style={{ fontWeight: 500 }}>Note:</span> Cline uses complex prompts and works best with Claude
							models. Less capable models may not work as expected.)
						</span>
					</p>
					<DebouncedTextField
						initialValue={apiConfiguration?.fireworksModelMaxCompletionTokens?.toString() || ""}
						onChange={(value) => handleNumberInputChange("fireworksModelMaxCompletionTokens", value)}
						style={{ width: "100%", marginBottom: 8 }}
						placeholder={"2000"}>
						<span style={{ fontWeight: 500 }}>Max Completion Tokens</span>
					</DebouncedTextField>
					<DebouncedTextField
						initialValue={apiConfiguration?.fireworksModelMaxTokens?.toString() || ""}
						onChange={(value) => handleNumberInputChange("fireworksModelMaxTokens", value)}
						style={{ width: "100%", marginBottom: 8 }}
						placeholder={"4000"}>
						<span style={{ fontWeight: 500 }}>Max Context Tokens</span>
					</DebouncedTextField>
				</>
			)}
		</div>
	)
}
