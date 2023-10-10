import * as React from 'react'
import { useState, useRef, useEffect, useLayoutEffect, forwardRef } from 'react'
import { createPortal } from 'react-dom'
import cx from 'clsx'
import { range } from 'rambda'
import { ui } from './current'
import { useForkRef } from '../utils/refs'
import teams from '../assets/teams.json'
import employees from '../assets/employees.json'

type ArrayElement<A> = A extends readonly (infer T)[] ? T : never
type Team = ArrayElement<typeof teams>
type Employee = ArrayElement<typeof employees>


export type Size = 'sm' | 'md' | 'lg'
export type Variant = 'primary' | 'secondary' | 'muted'

export type StyleProps = {
  size?: Size,
  variant?: Variant,
}

export type ComponentProps<T> = React.HTMLAttributes<T> & StyleProps & {}


export type SpinnerProps = ComponentProps<HTMLSpanElement> & {}
export const Spinner =  forwardRef<HTMLSpanElement, SpinnerProps>(
  function Spinner({ className }: SpinnerProps, ref) {
    return (
      <span className={cx('Spinner', className)} ref={ref} />
    )
  })

export type BoxProps = ComponentProps<HTMLSpanElement> & {
  padding?: number,
  horizontal?: boolean,
  vertical?: boolean,
  fill?: boolean,
  items?: 'stretch' | 'center' | 'start' | 'end',
  justify?: 'stretch' | 'center' | 'start' | 'end',
}
export const Box =  forwardRef<HTMLDivElement, BoxProps>(
  function Box({ className, horizontal, vertical, fill, items, justify, padding, ...rest }: BoxProps, ref) {
    horizontal = horizontal === undefined && vertical === undefined ? true : horizontal
    return (
      <div
        className={cx('Box', { horizontal, vertical, fill }, className)}
        style={{ alignItems: items, justifyContent: justify, padding: padding ? `${padding}rem` : undefined }}
        ref={ref}
        {...rest}
      />
    )
  })

export type GridProps = ComponentProps<HTMLSpanElement> & {
  gap?: number,
  rows?: string,
  columns?: string,
}
export const Grid =  forwardRef<HTMLDivElement, GridProps>(
  function Grid({ className, gap, rows, columns, ...rest }: GridProps, ref) {
    return (
      <div
        className={cx('Grid', className)}
        ref={ref}
        style={{
          rowGap: gap,
          columnGap: gap,
          gridTemplateRows: rows,
          gridTemplateColumns: columns,
        }}
        {...rest}
      />
    )
  })

export type HeadingProps = ComponentProps<HTMLHeadingElement> & {}
export const Heading =  forwardRef<HTMLHeadingElement, HeadingProps>(
  function Heading({ className, ...rest }: HeadingProps, ref) {
    return (
      <h3 className={cx('Heading', className)} ref={ref} {...rest} />
    )
  })

export type LinkProps = Omit<ComponentProps<HTMLAnchorElement>, 'href'> & { to: string }
export const Link =  forwardRef<HTMLAnchorElement, LinkProps>(
  function Link({ className, to, ...rest }: LinkProps, ref) {
    return (
      <a className={cx('Link', className)} ref={ref} href={to} {...rest} />
    )
  })

export type PopoverProps = ComponentProps<HTMLDivElement> & {
  open: boolean,
  trigger: React.ReactElement,
}
export const Popover =  forwardRef<HTMLDivElement, PopoverProps>(
  function Popover({ className, open, trigger, children, ...rest }: PopoverProps, ref) {
    const domNode = useRef<HTMLDivElement>()
    const triggerRef = useRef<HTMLDivElement>()
    const containerRef = useRef<HTMLDivElement>()
    const forkRef = useForkRef(containerRef, ref)
    if (!domNode.current) {
      domNode.current = document.createElement('div')
      document.body.appendChild(domNode.current)
    }
    useEffect(() => {
      return () => { domNode.current && document.body.removeChild(domNode.current) }
    }, [])

    useLayoutEffect(() => {
      if (!containerRef.current) return
      const dimensions = triggerRef.current!.getBoundingClientRect()
      containerRef.current.style.top = `${dimensions.top + dimensions.height}px`
      containerRef.current.style.left = `${dimensions.left}px`
    }, [open])

    return (
      <>
        {React.cloneElement(trigger, { ref: triggerRef })}
        {domNode.current && createPortal(
          open &&
            <div className='Popover' ref={forkRef} {...rest}>
              {children}
            </div>,
          domNode.current,
        )}
      </>
    )
  })

export type ButtonProps = ComponentProps<HTMLButtonElement> & {
  loading?: boolean,
  disabled?: boolean,
}
export const Button =  forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ className, size, variant, loading, children, ...rest }: ButtonProps, ref) {
    return (
      <button
        type='button'
        {...rest}
        className={cx('Button', size, variant, className)}
        ref={ref}
      >
        {loading && <Spinner />}
        {children}
      </button>
    )
  })

export type InputProps = ComponentProps<HTMLInputElement> & {
  value?: string,
  loading?: boolean,
  clearButton?: boolean,
}
export const Input =  forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, size, variant, loading, clearButton, ...rest }: InputProps, ref) {
    return (
      <ui.Box className={cx('Input', size, variant, className)}>
        {loading && <Spinner />}
        <input {...rest} className='Input__element' ref={ref} />
        {clearButton && <Button>clear</Button>}
      </ui.Box>
    )
  })

export type ColorProps = ComponentProps<HTMLInputElement> & {
  value?: string,
  loading?: boolean,
}
export const Color =  forwardRef<HTMLInputElement, ColorProps>(
  function Color({ className, size, variant, loading, ...rest }: ColorProps, ref) {
    return (
      <ui.Box className={cx('Color', size, variant, className)}>
        {loading && <Spinner />}
        <input {...rest} type='color' className='Color__element' ref={ref} />
      </ui.Box>
    )
  })

export type ComboboxOption = { value: string | number | null, label?: React.ReactNode }
export type ComboboxProps = InputProps & {
  value: string | number | null,
  options: ComboboxOption[],
}
export const Combobox =  forwardRef<HTMLDivElement, ComboboxProps>(
  function Combobox({
    className,
    size,
    variant,
    loading,
    clearButton,
    value,
    options,
    ...rest
  }: ComboboxProps, ref) {
    const [text, setText] = useState(String(value))
    const [isOpen, setOpen] = useState(false)
    const trigger =
      <ui.Box className={cx('Combobox', size, variant, className)} ref={ref} {...rest} items='stretch'>
        <ui.Input
          size={size}
          variant={variant}
          loading={loading}
          value={text}
          onChange={ev => setText((ev.target as any).value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
        />
        <ui.Button className='Combobox__arrow'>⌄</ui.Button>
      </ui.Box>

    return (
      <ui.Popover trigger={trigger} open={isOpen}>
        <ui.Box className='Combobox__options' vertical>
          {options.map(option =>
            <ui.Button key={option.value}>{option.label ?? String(option.value)}</ui.Button>
          )}
        </ui.Box>
      </ui.Popover>
    )
  })


export function Dashboard() {
  const [query, setQuery] = useState('')
  return (
    <ui.Box className='Dashboard' vertical>
      <ui.Box padding={1}>
        <ui.Input placeholder='Search...' value={query} onChange={e => setQuery((e.target as any).value)} />
      </ui.Box>
      <ui.Box fill>
        <ui.Sidebar />
        <ui.MainPanel />
      </ui.Box>
    </ui.Box>
  )
}

export function Sidebar() {
  return (
    <ui.Box className='Sidebar' vertical>
      <ui.Link to='/home'>Home</ui.Link>
      <ui.Link to='/categories'>Categories</ui.Link>
      {range(0, 25).map(n =>
        <ui.Link key={n} to={`/categories/${n}`}>Category {n}</ui.Link>
      )}
    </ui.Box>
  )
}

export function MainPanel() {
  return (
    <ui.Box className='MainPanel' vertical fill>
      <ui.TeamSection />
      <br />
      <ui.EmployeeSection />
    </ui.Box>
  )
}

export function EmployeeSection() {
  return (
    <ui.Box className='EmployeeSection' vertical>
      <ui.Heading>Employees</ui.Heading>
      <ui.EmployeeTable />
    </ui.Box>
  )
}

export function EmployeeTable() {
  const columns = Object.keys(employees[0])
  const countries = employees.map(e => ({ value: e.country }))

  const definitions = {
    country: {
      render: (value: Employee['country']) =>
        <ui.Combobox
          value={value}
          options={countries}
        />
    },
    favorite_color: {
      render: (value: Employee['favorite_color']) =>
        <ui.Color value={value} />
    }
  } as Record<string, { render: (v: any, row: Employee) => React.ReactNode }>

  return (
    <table>
      <thead>
        <tr>
          {columns.map(column =>
            <td>{column}</td>
          )}
        </tr>
      </thead>
      <tbody>
        {employees.slice(0, 30).map(employee =>
          <tr>
            {columns.map(column => {
              const definition = definitions[column]
              const value = employee[column as keyof typeof employee]

              let content: any
              if (definition) {
                content = definition.render(value, employee)
              } else {
                content = String(value)
              }

              return (
                <td>{content}</td>
              )
            }
            )}
          </tr>
        )}
      </tbody>
    </table>
  )
}

export function TeamSection() {
  return (
    <ui.Grid className='TeamSection' columns='repeat(3, 1fr)' gap={10}>
      {teams.map((team, i) =>
        <TeamCard key={i} team={team} />
      )}
    </ui.Grid>
  )
}

export function TeamCard({ team }: { team: Team }) {
  return (
    <ui.Box className='TeamCard' vertical>
      <ui.Heading>{team.team_name} ({team.team_size} members)</ui.Heading>
      <div>Lead: {team.team_lead}</div>
      <div>Location: {team.team_location}</div>
      <ui.Box>
        <ui.Button>View</ui.Button>
        <ui.Button>Edit</ui.Button>
      </ui.Box>
    </ui.Box>
  )
}
