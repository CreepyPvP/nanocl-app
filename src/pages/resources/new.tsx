import React from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import YAML from "yaml"

import { ApiContext } from "@/utils/api"

import PageTitle from "@/components/PageTitle"
import PageOverlay from "@/components/PageOverlay"
import ModalConfirm from "@/components/ModalConfirm"
import Button from "@/components/Button"
import YamlEditor from "@/components/YamlEditor"
import { PlusIcon } from "@heroicons/react/24/solid"
import MetaHeader from "@/components/MetaHeader"

export default function Resource() {
  const router = useRouter()
  const api = React.useContext(ApiContext)
  const [content, setContent] = React.useState<string>("")
  const [isSaveConfirmOpen, setSaveIsConfirmOpen] = React.useState(false)

  React.useEffect(() => {
    if (!router.isReady) return

    if (content === "") {
      const yaml = YAML.stringify({
        Name: "my-resource",
        Version: "v0.1",
        Kind: "ProxyRule",
        Config: {},
      })
      setContent(yaml)
    }
  }, [content, router.isReady])

  async function onSave() {
    const parsed = YAML.parse(content)
    await api.instance
      .post(`/resources`, parsed)
      .then((res) => {
        router.push(`/resources`)
      })
      .catch((err) => {
        const res = err.response
        throw new Error(res?.data?.msg || res?.data || "An error occured")
      })
  }

  function openOnSave() {
    if (content === "") return
    setSaveIsConfirmOpen(true)
  }

  function closeOnSave() {
    setSaveIsConfirmOpen(false)
  }

  function onChange(value: string | undefined) {
    setContent(value || "")
  }

  return (
    <>
      {isSaveConfirmOpen ? (
        <ModalConfirm
          title="Are you sure to save this resource ?"
          onClose={closeOnSave}
          onCancel={closeOnSave}
          onConfirm={onSave}
        />
      ) : null}
      <MetaHeader title="New Resource" />
      <main id="nano-main">
        <PageOverlay>
          <PageTitle
            title="New Resource"
            actions={[
              {
                title: "Save",
                onClick: openOnSave,
                className: "bg-green-500 hover:bg-green-700",
                icon: <PlusIcon className="h-4 w-4" />,
              },
            ]}
          />
          <div className="flex w-full justify-between">
            <div className="flex">
              <h3>New Resource</h3>
            </div>
            <div className="flex">
              {content !== "" ? (
                <Button
                  title="Save"
                  onClick={openOnSave}
                  className="min-w-fit bg-green-500 hover:bg-green-700"
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              ) : null}
            </div>
          </div>
          <YamlEditor isReadOnly={false} onChange={onChange}>
            {content}
          </YamlEditor>
        </PageOverlay>
      </main>
    </>
  )
}
