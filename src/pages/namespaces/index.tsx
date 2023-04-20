import React from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import {
  MagnifyingGlassIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/solid"
import { ApiContext } from "@/utils/api"
import type * as Types from "@/utils/types"

import PageTitle from "@/components/PageTitle"
import PageOverlay from "@/components/PageOverlay"
import Table from "@/components/Table"
import Button from "@/components/Button"
import ModalInput from "@/components/ModalInput"
import ModalConfirm from "@/components/ModalConfirm"

export default function Namespaces() {
  const router = useRouter()
  const api = React.useContext(ApiContext)
  const isCreateOpen = typeof router.query.Create !== "undefined"
  const isDeleteOpen = typeof router.query.Delete !== "undefined"
  const [namespaces, setNamespaces] = React.useState<Types.NamespaceRow[]>([])

  React.useEffect(() => {
    if (!api.url || (!router.isReady && isCreateOpen && isDeleteOpen)) return
    api.instance.get("/namespaces").then((res) => {
      setNamespaces(res.data)
    })
  }, [
    api.url,
    api.instance,
    router.isReady,
    isCreateOpen,
    isDeleteOpen,
    setNamespaces,
  ])

  function closeModal() {
    router.push("/namespaces")
  }

  async function onCreate(value: string) {
    await api.instance
      .post("/namespaces", { Name: value })
      .then(() => {
        closeModal()
      })
      .catch((err) => {
        const res = err?.response
        throw new Error(
          res?.data?.msg || res?.data || err.message || "An error occured",
        )
      })
  }

  async function onDelete() {
    await api.instance
      .delete(`/namespaces/${router.query.Delete}`)
      .then(() => {
        closeModal()
      })
      .catch((err) => {
        const res = err?.response
        throw new Error(
          res?.data?.msg || res?.data || err.message || "An error occured",
        )
      })
  }

  return (
    <>
      {isCreateOpen ? (
        <ModalInput
          title="Create a new namespace"
          label="Name"
          placeholder="my-namespace"
          onClose={closeModal}
          onConfirm={onCreate}
        />
      ) : null}
      {isDeleteOpen ? (
        <ModalConfirm
          title={`Are you sure to delete ${router.query.Delete} ?`}
          onClose={closeModal}
          onConfirm={onDelete}
          onCancel={closeModal}
        />
      ) : null}
      <Head>
        <title>Namespaces | Nanocl Dashboard</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.webp" />
      </Head>
      <main id="nano-main">
        <PageOverlay>
          <PageTitle>
            <div className="flex w-full flex-row items-center justify-between">
              <div className="flex flex-row items-center">
                <h3 className="text-xl">Namespaces</h3>
              </div>
              <div className="flex flex-row">
                <Button
                  title="New"
                  className="min-w-fit bg-green-500 hover:bg-green-700"
                  onClick={() => {
                    router.push("/namespaces?Create")
                  }}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </PageTitle>
          <Table
            ID="Name"
            Data={namespaces}
            Columns={[
              { Name: "Name", Key: "Name" },
              { Name: "Gateway", Key: "Gateway" },
              { Name: "Instances", Key: "Instances" },
              { Name: "Cargoes", Key: "Cargoes" },
              {
                Name: "Actions",
                Key: "Actions",
                Render: (row: any) => (
                  <div className="flex">
                    <Button
                      title="Delete"
                      className="mr-2 min-w-fit bg-red-500 hover:bg-red-700"
                      onClick={() => {
                        router.push(`/namespaces?Delete=${row.Name}`)
                      }}
                    >
                      <MinusIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      title="Inspect"
                      className="min-w-fit bg-blue-500 hover:bg-blue-700"
                      onClick={() => {
                        router.push(`/namespaces/${row.Name}`)
                      }}
                    >
                      <MagnifyingGlassIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </PageOverlay>
      </main>
    </>
  )
}